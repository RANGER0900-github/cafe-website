import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Phone } from 'lucide-react';
import { SiZomato } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { formatExternalLink } from '../utils/linkUtils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AllMenu = () => {
    const { content } = useContent();
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); }
    }, []);

    if (!content) return null;
    
    const allItems = content.projects || [];
    const { social, contact } = content;
    const redirectType = content.redirectType || 'zomato';

    const categories = [
        "All",
        "Hot Beverages",
        "Cold Beverages",
        "Breakfast",
        "Main Course",
        "Desserts",
        "Snacks & Appetizers"
    ];

    const filteredItems = activeCategory === "All"
        ? allItems
        : allItems.filter(item => item.category === activeCategory);

    const handleItemClick = (item) => {
        if (redirectType === 'call' && contact?.phone) {
            window.location.href = `tel:${contact.phone}`;
        } else if (item.link) {
            try {
                fetch('/api/track/reel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reelId: item.id })
                }).catch(() => { });
            } catch (e) { }
            window.open(formatExternalLink(item.link), '_blank');
        }
    };

    return (
        <div className="bg-background min-h-screen text-white relative overflow-hidden">
            <Navbar />

            <main className="pt-32 px-6 max-w-[1920px] mx-auto pb-0">
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <Link to="/" className="text-primary font-mono text-xs tracking-[0.2em] mb-4 hover:underline">← BACK TO HOME</Link>
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4">Our Menu<span className="text-primary">.</span></h1>
                    <p className="text-cafe-cream/70 text-lg max-w-2xl">Explore our handcrafted selection of artisanal beverages and gourmet dishes</p>

                    {/* Order CTA */}
                    <div className="mt-8 flex items-center gap-4">
                        {redirectType === 'zomato' && social?.zomato && (
                            <a 
                                href={formatExternalLink(social.zomato)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_30px_rgba(212,165,116,0.5)]"
                            >
                                <SiZomato size={20} />
                                Order on Zomato
                            </a>
                        )}
                        {contact?.phone && (
                            <a 
                                href={`tel:${contact.phone}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-primary/30 text-white rounded-full font-bold hover:bg-primary hover:text-black transition-all"
                            >
                                <Phone size={20} />
                                Call to Order
                            </a>
                        )}
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto mt-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group ${
                                    activeCategory === cat
                                        ? 'bg-primary text-black shadow-[0_0_20px_rgba(212,165,116,0.4)] scale-105'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-primary hover:text-primary hover:bg-white/10'
                                }`}
                            >
                                <span className="relative z-10">{cat}</span>
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeMenuTab"
                                        className="absolute inset-0 bg-primary"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <motion.div layout className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8 mb-32 px-4 md:px-12">
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4 }}
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/40 bg-card-bg mb-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,165,116,0.2)]`}
                            >
                                <div className="relative aspect-[9/16]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Content */}
                                    <div
                                        className="absolute w-full z-10 p-6 transition-transform duration-300 pointer-events-none group-hover:translate-y-[-5px]"
                                        style={{
                                            left: item.textPosition ? `${item.textPosition.x}%` : '50%',
                                            top: item.textPosition ? `${item.textPosition.y}%` : '85%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                            color: item.textColor || '#ffffff',
                                        }}
                                    >
                                        <span
                                            className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 backdrop-blur-md"
                                            style={{
                                                backgroundColor: 'rgba(212,165,116,0.2)',
                                                border: '1px solid rgba(212,165,116,0.3)',
                                                color: '#d4a574'
                                            }}
                                        >
                                            {item.category}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight drop-shadow-lg mb-2">{item.title}</h3>
                                        {item.price && (
                                            <p className="text-primary text-xl font-bold drop-shadow-lg">{item.price}</p>
                                        )}
                                        {item.description && (
                                            <p className="text-cafe-cream text-sm mt-2 leading-relaxed max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="absolute top-6 right-6 w-12 h-12 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-black text-primary transition-all duration-300 group-hover:scale-110 shadow-lg">
                                        {redirectType === 'call' ? (
                                            <Phone className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Corner decorations */}
                                    <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300"></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default AllMenu;
