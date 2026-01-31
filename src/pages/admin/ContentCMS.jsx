import { useState, useRef, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import {
    Save, Plus, Trash, Image as ImageIcon, Link as LinkIcon, Upload, Loader2,
    Eye, EyeOff, Palette, Move, Star, Instagram, Mail, Youtube, Twitter,
    GripVertical, ExternalLink, User, MessageSquare
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ContentCMS = () => {
    const { content, updateContent } = useContent();
    const [localContent, setLocalContent] = useState(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [uploading, setUploading] = useState(null);
    const [previewProject, setPreviewProject] = useState(null);
    const [draggedText, setDraggedText] = useState({ x: 50, y: 50 });
    const fileInputRef = useRef(null);
    const [currentUploadTarget, setCurrentUploadTarget] = useState({ type: null, id: null });

    // Initialize localContent when content is loaded
    useEffect(() => {
        if (content && !localContent) {
            setLocalContent({
                ...content,
                projects: content.projects || [],
                social: content.social || { email: '', instagram: '', youtube: '', twitter: '' },
                reviews: content.reviews || [],
                footer: content.footer || { copyright: '', showSocial: true }
            });
        }
    }, [content, localContent]);

    if (!localContent) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-secondary" size={32} />
            <span className="ml-3 text-white">Loading Content Manager...</span>
        </div>
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateContent(localContent);
            toast.success('Content updated successfully!');
        } catch (err) {
            toast.error('Failed to update content');
        }
        setSaving(false);
    };

    // Project handlers
    const handleProjectChange = (id, field, value) => {
        const updatedProjects = localContent.projects.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        setLocalContent({ ...localContent, projects: updatedProjects });
    };

    const addProject = () => {
        const newProject = {
            id: Date.now(),
            title: "New Project",
            category: "Fashion & Apparel",
            image: "https://images.unsplash.com/photo-1549557613-21c6020586a0",
            link: "",
            orientation: "portrait",
            textColor: "#ffffff",
            textPosition: { x: 50, y: 85 }
        };
        setLocalContent({
            ...localContent,
            projects: [newProject, ...(localContent.projects || [])]
        });
        toast.success("New Project Added!");
    };

    const removeProject = (id) => {
        if (!window.confirm("Delete this project?")) return;
        const updatedProjects = localContent.projects.filter(p => p.id !== id);
        setLocalContent({ ...localContent, projects: updatedProjects });
        toast.success("Project Deleted");
    };

    // Review handlers
    const handleReviewChange = (id, field, value) => {
        const updatedReviews = localContent.reviews.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        );
        setLocalContent({ ...localContent, reviews: updatedReviews });
    };

    const addReview = () => {
        const newReview = {
            id: Date.now(),
            name: "New Review",
            role: "Client",
            text: "Amazing work!",
            image: "https://randomuser.me/api/portraits/lego/1.jpg"
        };
        setLocalContent({ ...localContent, reviews: [newReview, ...(localContent.reviews || [])] });
        toast.success("New Review Added!");
    };

    const removeReview = (id) => {
        if (!window.confirm("Delete this review?")) return;
        const updatedReviews = localContent.reviews.filter(r => r.id !== id);
        setLocalContent({ ...localContent, reviews: updatedReviews });
        toast.success("Review Deleted");
    };

    // Image Upload Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentUploadTarget.type) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Use JPG, PNG, GIF, or WebP.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Max 5MB.');
            return;
        }

        setUploading(currentUploadTarget.id);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target.result;

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file: base64, filename: file.name, type: file.type })
                });

                const data = await response.json();

                if (data.success && data.url) {
                    if (currentUploadTarget.type === 'project') {
                        handleProjectChange(currentUploadTarget.id, 'image', data.url);
                    } else if (currentUploadTarget.type === 'review') {
                        handleReviewChange(currentUploadTarget.id, 'image', data.url);
                    }
                    toast.success('Image uploaded successfully!');
                } else {
                    toast.error(data.error || 'Upload failed');
                }

                setUploading(null);
                setCurrentUploadTarget({ type: null, id: null });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Upload failed: ' + error.message);
            setUploading(null);
            setCurrentUploadTarget({ type: null, id: null });
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerUpload = (type, id) => {
        setCurrentUploadTarget({ type, id });
        fileInputRef.current?.click();
    };

    const categories = [
        "Beauty & Personal Care", "Food & Beverage", "Fitness & Wellness",
        "Fashion & Apparel", "Travel & Local experience", "Tech & Gadgets",
        "Real Estate", "Other"
    ];

    const colorPresets = ['#ffffff', '#64ffda', '#0070f3', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#000000'];

    // Preview Modal Component
    const ProjectPreview = ({ project, onClose }) => {
        const [textPos, setTextPos] = useState(project.textPosition || { x: 50, y: 85 });
        const [isDragging, setIsDragging] = useState(false);
        const previewRef = useRef(null);

        const handleMouseMove = (e) => {
            if (!isDragging || !previewRef.current) return;
            const rect = previewRef.current.getBoundingClientRect();
            const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
            const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
            setTextPos({ x, y });
        };

        const handleMouseUp = () => {
            if (isDragging) {
                handleProjectChange(project.id, 'textPosition', textPos);
                setIsDragging(false);
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="relative max-w-md w-full"
                    onClick={e => e.stopPropagation()}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        ref={previewRef}
                        className="relative aspect-[9/16] rounded-2xl overflow-hidden border-4 border-white/10"
                    >
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        <div
                            className="absolute cursor-move select-none"
                            style={{
                                left: `${textPos.x}%`,
                                top: `${textPos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                color: project.textColor || '#ffffff'
                            }}
                            onMouseDown={() => setIsDragging(true)}
                        >
                            <div className="flex items-center gap-1 opacity-50 text-xs mb-1">
                                <GripVertical size={12} /> Drag to move
                            </div>
                            <h3 className="text-2xl font-bold drop-shadow-lg">{project.title}</h3>
                            <p className="text-sm opacity-80">{project.category}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                        <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                            Close Preview
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <Toaster position="bottom-right" toastOptions={{
                style: { background: '#112240', color: '#64ffda', border: '1px solid rgba(100,255,218,0.2)' }
            }} />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-display font-black text-white mb-2">Content CMS<span className="text-primary">.</span></h1>
                    <p className="text-gray-400">Manage your portfolio content, projects, and reviews.</p>
                </div>
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-secondary text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_20px_rgba(100,255,218,0.3)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </motion.button>
            </header>

            {/* Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 flex-wrap">
                {['projects', 'reviews', 'hero', 'social', 'footer'].map(tab => (
                    <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider transition-all border text-sm ${activeTab === tab
                            ? 'bg-white/10 border-primary text-primary shadow-[0_0_15px_rgba(100,255,218,0.2)]'
                            : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {tab}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode='wait'>
                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                    <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <motion.button onClick={addProject} className="w-full py-6 border-2 border-dashed border-white/10 rounded-3xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-bold text-lg" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Plus size={24} /> ADD NEW PROJECT
                        </motion.button>

                        <div className="grid grid-cols-1 gap-6">
                            {localContent.projects && localContent.projects.length > 0 ? localContent.projects.map((project) => (
                                <motion.div key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#112240]/50 border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 group hover:border-white/20 transition-all">
                                    {/* Image Preview */}
                                    <div className="w-full lg:w-56 flex-shrink-0">
                                        <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-[3/4] border border-white/10">
                                            {project.image ? (
                                                <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={40} /></div>
                                            )}
                                            {uploading === project.id && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                    <Loader2 size={32} className="text-secondary animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <motion.button onClick={() => triggerUpload('project', project.id)} disabled={uploading === project.id} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/50 rounded-lg text-gray-400 hover:text-secondary transition-all text-xs font-bold" whileHover={{ scale: 1.02 }}>
                                                <Upload size={14} /> Upload
                                            </motion.button>
                                            <motion.button onClick={() => setPreviewProject(project)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-lg text-gray-400 hover:text-primary transition-all text-xs font-bold" whileHover={{ scale: 1.02 }}>
                                                <Eye size={14} /> Preview
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Edit Fields */}
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title</label>
                                                <input type="text" value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                                                <select value={project.category} onChange={(e) => handleProjectChange(project.id, 'category', e.target.value)} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none">
                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Image URL</label>
                                            <input type="text" value={project.image} onChange={(e) => handleProjectChange(project.id, 'image', e.target.value)} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-cyan-300 focus:border-primary focus:outline-none" placeholder="https://..." />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2"><LinkIcon size={14} /> Redirect Link</label>
                                            <input type="text" value={project.link || ''} onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)} className="w-full bg-[#0a192f] border border-primary/30 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none placeholder-white/20" placeholder="https://instagram.com/reel/..." />
                                        </div>

                                        {/* Text Color Picker */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><Palette size={14} /> Text Color</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-2">
                                                    {colorPresets.map(color => (
                                                        <button key={color} onClick={() => handleProjectChange(project.id, 'textColor', color)} className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${project.textColor === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                                                    ))}
                                                </div>
                                                <input type="color" value={project.textColor || '#ffffff'} onChange={(e) => handleProjectChange(project.id, 'textColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" />
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-2">
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Move size={12} /> Use Preview to drag text position</span>
                                            <motion.button onClick={() => removeProject(project.id)} className="text-red-400 hover:text-red-500 flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all text-sm font-bold" whileHover={{ scale: 1.05 }}>
                                                <Trash size={16} /> Remove
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-16 text-gray-500">
                                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No projects found. Add your first project above!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <motion.button onClick={addReview} className="w-full py-6 border-2 border-dashed border-white/10 rounded-3xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-bold text-lg" whileHover={{ scale: 1.01 }}>
                            <Plus size={24} /> ADD NEW REVIEW
                        </motion.button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {localContent.reviews && localContent.reviews.length > 0 ? localContent.reviews.map((review) => (
                                <motion.div key={review.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#112240]/50 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative">
                                            <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                                            <button onClick={() => triggerUpload('review', review.id)} className="absolute -bottom-1 -right-1 p-1.5 bg-secondary rounded-full text-black hover:scale-110 transition-transform">
                                                {uploading === review.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <input type="text" value={review.name} onChange={(e) => handleReviewChange(review.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-1 text-white font-bold focus:border-primary focus:outline-none" placeholder="Reviewer Name" />
                                            <input type="text" value={review.role} onChange={(e) => handleReviewChange(review.id, 'role', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-1 text-gray-400 text-sm mt-1 focus:border-primary focus:outline-none" placeholder="Role/Title" />
                                        </div>
                                        <button onClick={() => removeReview(review.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><MessageSquare size={12} /> Review Text</label>
                                        <textarea value={review.text} onChange={(e) => handleReviewChange(review.id, 'text', e.target.value)} rows={3} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none resize-none" placeholder="What did they say?" />
                                    </div>
                                    <div className="mt-3">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Image URL</label>
                                        <input type="text" value={review.image} onChange={(e) => handleReviewChange(review.id, 'image', e.target.value)} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-cyan-300 focus:border-primary focus:outline-none" placeholder="https://..." />
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-2 text-center py-16 text-gray-500">
                                    <Star size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No reviews yet. Add client testimonials above!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* HERO TAB */}
                {activeTab === 'hero' && (
                    <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                        <div className="bg-[#112240]/50 p-8 rounded-3xl border border-white/5 space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Title</label>
                                <input type="text" value={localContent.hero?.title || ''} onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, title: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white text-2xl font-bold focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Subtitle</label>
                                <input type="text" value={localContent.hero?.subtitle || ''} onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, subtitle: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                                <textarea value={localContent.hero?.description || ''} onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, description: e.target.value } })} rows={4} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Button Text</label>
                                <input type="text" value={localContent.hero?.buttonText || ''} onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, buttonText: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SOCIAL TAB */}
                {activeTab === 'social' && (
                    <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                        <div className="bg-[#112240]/50 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-lg font-bold text-white mb-4">Social Media Links</h3>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><Mail size={14} /> Email Address</label>
                                <input type="email" value={localContent.social?.email || ''} onChange={(e) => setLocalContent({ ...localContent, social: { ...localContent.social, email: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="your@email.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><Instagram size={14} /> Instagram</label>
                                <input type="url" value={localContent.social?.instagram || ''} onChange={(e) => setLocalContent({ ...localContent, social: { ...localContent.social, instagram: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="https://instagram.com/username" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><Youtube size={14} /> YouTube</label>
                                <input type="url" value={localContent.social?.youtube || ''} onChange={(e) => setLocalContent({ ...localContent, social: { ...localContent.social, youtube: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="https://youtube.com/@channel" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2"><Twitter size={14} /> Twitter/X</label>
                                <input type="url" value={localContent.social?.twitter || ''} onChange={(e) => setLocalContent({ ...localContent, social: { ...localContent.social, twitter: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="https://x.com/username" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* FOOTER TAB */}
                {activeTab === 'footer' && (
                    <motion.div key="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                        <div className="bg-[#112240]/50 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-lg font-bold text-white mb-4">Footer Settings</h3>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Copyright Text</label>
                                <input type="text" value={localContent.footer?.copyright || ''} onChange={(e) => setLocalContent({ ...localContent, footer: { ...localContent.footer, copyright: e.target.value } })} className="w-full bg-[#0a192f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="© 2026 Your Name. All rights reserved." />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#0a192f] rounded-xl border border-white/10">
                                <div>
                                    <p className="text-white font-bold">Show Social Icons in Footer</p>
                                    <p className="text-xs text-gray-500">Display Instagram, YouTube, etc. icons</p>
                                </div>
                                <button onClick={() => setLocalContent({ ...localContent, footer: { ...localContent.footer, showSocial: !localContent.footer?.showSocial } })} className={`w-14 h-8 rounded-full transition-colors relative ${localContent.footer?.showSocial ? 'bg-secondary' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${localContent.footer?.showSocial ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewProject && <ProjectPreview project={previewProject} onClose={() => setPreviewProject(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default ContentCMS;
