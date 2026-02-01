import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { formatExternalLink } from '../utils/linkUtils';
import { SiZomato } from 'react-icons/si';

const Footer = () => {
    const { content } = useContent();

    if (!content) return null;
    const { footer, social } = content;

    if (!footer) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 pt-20 pb-12">
            {/* Smooth curve SVG at top */}
            <svg 
                className="w-full h-20 -mb-1" 
                viewBox="0 0 1200 100" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(100,255,218,0.1)" />
                        <stop offset="100%" stopColor="rgba(100,255,218,0)" />
                    </linearGradient>
                </defs>
                <path 
                    d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z" 
                    fill="url(#footerGradient)"
                />
                <path 
                    d="M0,50 Q300,0 600,50 T1200,50" 
                    stroke="rgba(100,255,218,0.2)" 
                    strokeWidth="2" 
                    fill="none"
                />
            </svg>

            {/* Footer Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="px-6 border-t border-white/5 bg-gradient-to-b from-[#0a192f]/80 to-black backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Copyright */}
                    <motion.div 
                        className="text-gray-400 text-sm font-light tracking-wide"
                        whileHover={{ color: '#64ffda' }}
                        transition={{ duration: 0.3 }}
                    >
                        {footer.copyright || `© ${currentYear} MISHWA. All rights reserved.`}
                    </motion.div>

                    {/* Social Icons */}
                    {footer.showSocial && social && (
                        <motion.div 
                            className="flex items-center gap-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {social.instagram && (
                                <motion.a 
                                    href={formatExternalLink(social.instagram)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-gray-400 hover:text-primary transition-all p-2 hover:bg-primary/10 rounded-lg"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Instagram size={20} />
                                </motion.a>
                            )}
                            {social.zomato && (
                                <motion.a 
                                    href={formatExternalLink(social.zomato)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-gray-400 hover:text-primary transition-all p-2 hover:bg-primary/10 rounded-lg"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Order on Zomato"
                                >
                                    <SiZomato size={20} />
                                </motion.a>
                            )}
                            {social.phone && (
                                <motion.a 
                                    href={`tel:${social.phone}`} 
                                    className="text-gray-400 hover:text-primary transition-all p-2 hover:bg-primary/10 rounded-lg"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Call us"
                                >
                                    <Phone size={20} />
                                </motion.a>
                            )}
                            {social.email && (
                                <motion.a 
                                    href={`mailto:${social.email}`} 
                                    className="text-gray-400 hover:text-primary transition-all p-2 hover:bg-primary/10 rounded-lg"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Mail size={20} />
                                </motion.a>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
