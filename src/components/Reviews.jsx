import { motion } from 'framer-motion';
import { Mail, Instagram, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { formatExternalLink } from '../utils/linkUtils';

const Reviews = () => {
    const { content } = useContent();

    if (!content) return null;
    const { reviews, social } = content;

    return (
        <section id="about" className="py-32 px-6 bg-gradient-to-b from-background to-[#112240] relative overflow-hidden will-change-transform">

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                {/* About & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group">
                            <img src="/images/mishwa_portrait.png" alt="Mishwa" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 will-change-transform" />
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    <div>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">About Me</span>
                        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">More Than Just Cuts.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            I'm Mishwa, a visual artist who understands the psychology of attention.
                            My edits don't just look good—they perform. With a focus on pacing, sound design, and visual storytelling,
                            I help brands convert viewers into followers.
                        </p>

                        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div>
                                <h4 className="text-3xl font-bold text-white">3+</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Years</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white">500+</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Polished</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white">50M+</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Views</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Client Love<span className="text-secondary">.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review.id || i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{
                                    y: -10,
                                    borderColor: 'rgba(100, 255, 218, 0.3)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                    transition: { duration: 0.2, delay: 0 }
                                }}
                                className="p-10 bg-background/50 backdrop-blur-sm rounded-3xl border border-white/5 relative group cursor-default"
                            >
                                <div className="absolute top-8 right-8 text-primary/20 text-7xl font-serif leading-none">"</div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 group-hover:border-primary transition-colors duration-200">
                                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic text-lg relative z-10 leading-relaxed">{review.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final CTA (Merged Contact) */}
                <div id="contact" className="bg-primary/5 rounded-[3rem] p-12 md:p-24 relative overflow-hidden border border-primary/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full gap-8">
                        <div className="flex-1 w-full text-left">
                            <h2 className="text-6xl md:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter">
                                READY TO<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">LEVEL UP?</span>
                            </h2>
                        </div>

                        {/* Action Buttons - Right Side */}
                        <div className="flex flex-col gap-6 items-center md:items-end">
                            <a href={`mailto:${social.email}`} className="group relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <ArrowUpRight className="text-black w-12 h-12 relative z-10 group-hover:rotate-45 transition-transform duration-300" />
                                <span className="absolute bottom-6 font-bold text-[10px] uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">Email</span>
                            </a>

                            <a href={formatExternalLink(social.instagram)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 group">
                                <Instagram className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-widest text-sm">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Reviews;
