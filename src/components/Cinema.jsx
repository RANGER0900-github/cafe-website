import { motion } from 'framer-motion';

const Cinema = () => {
    return (
        <section id="cinema" className="py-20 px-6 relative z-10 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Cinematic</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-2 text-white">Long Form Works<span className="text-secondary">.</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="group relative aspect-video bg-card-bg rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                    >
                        <img src="/images/cinematic_thumbnail_1.png" alt="Documentary" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2 block">Documentary</span>
                            <h3 className="text-3xl font-bold mb-2 text-white">The Summit</h3>
                            <p className="text-gray-400 text-sm max-w-sm">A journey to the highest peaks using cinematic drone shots.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="group relative aspect-video bg-card-bg rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                    >
                        {/* Fallback gradient for missing image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Commercial</span>
                            <h3 className="text-3xl font-bold mb-2 text-white">Velocity</h3>
                            <p className="text-gray-400 text-sm max-w-sm">High-speed automotive commercial featuring dynamic ramping.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Cinema;
