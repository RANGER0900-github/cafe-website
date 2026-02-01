import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { formatExternalLink } from '../utils/linkUtils';

const Menu = () => {
    const { content } = useContent();

    if (!content) return null;
    
    const featuredIds = content.featuredItems || [101, 102, 103, 104];
    const allItems = content.projects || [];
    const featuredItems = allItems.filter(item => featuredIds.includes(item.id)).slice(0, 4);
    const redirectType = content.redirectType || 'zomato';

    const handleItemClick = (item) => {
        if (redirectType === 'call' && content.contact?.phone) {
            window.location.href = `tel:${content.contact.phone}`;
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
        <section id="menu" className="py-32 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block"
                        >
                            Handcrafted Delights
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold font-display mb-4 text-white"
                        >
                            Featured Dishes<span className="text-secondary">.</span>
                        </motion.h2>
                    </div>
                    <div className="hidden md:block w-32 h-[1px] bg-white/10"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative aspect-[9/16] bg-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                            </div>

                            <div
                                className="absolute w-full z-10 transition-transform duration-300 pointer-events-none"
                                style={{
                                    left: item.textPosition ? `${item.textPosition.x}%` : '50%',
                                    top: item.textPosition ? `${item.textPosition.y}%` : '85%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                    color: item.textColor || '#ffffff',
                                    width: '90%'
                                }}
                            >
                                <span
                                    className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 backdrop-blur-md"
                                    style={{
                                        backgroundColor: item.textColor ? `${item.textColor}20` : 'rgba(212,165,116,0.2)',
                                        border: `1px solid ${item.textColor ? `${item.textColor}30` : 'rgba(212,165,116,0.3)'}`,
                                        color: item.textColor || '#d4a574'
                                    }}
                                >
                                    {item.category}
                                </span>
                                <h3 className="text-xl font-bold leading-tight mb-1 drop-shadow-lg">{item.title}</h3>
                                {item.price && (
                                    <p className="text-primary text-lg font-bold">{item.price}</p>
                                )}
                            </div>

                            {/* Order/View Button */}
                            <button
                                onClick={() => handleItemClick(item)}
                                className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-primary/10 backdrop-blur-md border border-primary/30 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(212,165,116,0.5)]"
                                aria-label={redirectType === 'call' ? 'Call to order' : 'View on Zomato'}
                            >
                                {redirectType === 'call' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                )}
                            </button>

                            {/* Hover Glow Border */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl shadow-[0_0_30px_rgba(212,165,116,0.3)]"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link 
                        to="/menu" 
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-full hover:bg-primary hover:text-black hover:scale-105 transition-all duration-300 font-bold text-sm uppercase tracking-widest text-white hover:shadow-[0_0_30px_rgba(212,165,116,0.4)]"
                    >
                        View Full Menu
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Menu;
