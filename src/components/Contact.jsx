import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-32 px-6 text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-primary font-bold tracking-widest uppercase text-sm mb-6 block"
                >
                    Get In Touch
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-8xl font-bold font-display text-white mb-10"
                >
                    LET'S WORK<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TOGETHER</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <a href="mailto:mishwa@example.com" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <Mail size={20} />
                        mishwa@example.com
                    </a>
                    <a href="https://instagram.com" target="_blank" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                        <Instagram size={20} />
                        @mishwazalavadiya
                    </a>
                </motion.div>

                <footer className="mt-32 text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} Mishwa Zalavadiya. All rights reserved.</p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
