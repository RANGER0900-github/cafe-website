import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const Cinema = () => {
    const { content } = useContent();

    if (!content?.cinema) return null;
    const { cinema } = content;

    return (
        <section id="specials" className="py-20 px-6 relative z-10 bg-gradient-to-b from-background to-cafe-dark">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">{cinema.subtitle || 'Signature Creations'}</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-2 text-white">{cinema.title || 'Our Specialties'}<span className="text-secondary">.</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cinema.items && cinema.items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="group relative aspect-video bg-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,165,116,0.2)]"
                        >
                            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                            
                            {/* Cafe-themed overlay glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="absolute bottom-0 left-0 p-8 transition-transform duration-300 group-hover:translate-y-[-10px]">
                                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">{item.category}</span>
                                <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{item.title}</h3>
                                <p className="text-cafe-cream text-sm max-w-sm leading-relaxed">{item.description}</p>
                            </div>
                            
                            {/* Corner accent */}
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Cinema;
