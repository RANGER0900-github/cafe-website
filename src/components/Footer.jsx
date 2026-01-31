import { motion } from 'framer-motion';
import { Instagram, Youtube, Twitter, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { formatExternalLink } from '../utils/linkUtils';

const Footer = () => {
    const { content } = useContent();

    if (!content) return null;
    const { footer, social } = content;

    if (!footer) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-6 border-t border-white/5 bg-[#0a192f] relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Copyright */}
                <div className="text-gray-500 text-sm">
                    {footer.copyright || `© ${currentYear} Panda Portfolio. All rights reserved.`}
                </div>

                {/* Social Icons */}
                {footer.showSocial && social && (
                    <div className="flex items-center gap-6">
                        {social.instagram && (
                            <a href={formatExternalLink(social.instagram)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        )}
                        {social.youtube && (
                            <a href={formatExternalLink(social.youtube)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube size={20} />
                            </a>
                        )}
                        {social.twitter && (
                            <a href={formatExternalLink(social.twitter)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                        )}
                        {social.email && (
                            <a href={`mailto:${social.email}`} className="text-gray-400 hover:text-white transition-colors">
                                <Mail size={20} />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;
