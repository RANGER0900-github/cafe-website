import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Location = () => {
    const { content } = useContent();

    if (!content) return null;

    const { contact, about } = content;
    const coordinates = contact?.coordinates || { lat: 40.7580, lng: -73.9855 };
    const mapSrc = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <section id="location" className="py-32 px-6 bg-gradient-to-b from-cafe-dark to-background relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
                    >
                        Visit Us
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
                    >
                        Find Us Here<span className="text-secondary">.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Cafe Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group">
                            <img 
                                src={about?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop'} 
                                alt="Cafe De Meet Interior" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                            <div className="absolute bottom-6 left-6">
                                <p className="text-cafe-cream text-xl font-display font-bold">Your cozy corner awaits</p>
                            </div>
                        </div>

                        {/* Contact Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Address */}
                            <motion.div
                                whileHover={{ y: -5, borderColor: 'rgba(212,165,116,0.5)' }}
                                className="p-6 bg-card-bg/50 backdrop-blur-sm rounded-2xl border border-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Location</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {contact?.address || '123 Coffee Street, Downtown, NY 10001'}
                                </p>
                            </motion.div>

                            {/* Phone */}
                            <motion.div
                                whileHover={{ y: -5, borderColor: 'rgba(212,165,116,0.5)' }}
                                className="p-6 bg-card-bg/50 backdrop-blur-sm rounded-2xl border border-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <Phone className="text-primary" size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Phone</h3>
                                <a 
                                    href={`tel:${contact?.phone}`} 
                                    className="text-gray-400 text-sm hover:text-primary transition-colors"
                                >
                                    {contact?.phone || '+1 (555) 123-4567'}
                                </a>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                whileHover={{ y: -5, borderColor: 'rgba(212,165,116,0.5)' }}
                                className="p-6 bg-card-bg/50 backdrop-blur-sm rounded-2xl border border-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="text-primary" size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Email</h3>
                                <a 
                                    href={`mailto:${contact?.email}`} 
                                    className="text-gray-400 text-sm hover:text-primary transition-colors"
                                >
                                    {contact?.email || 'hello@cafedemeet.com'}
                                </a>
                            </motion.div>

                            {/* Hours */}
                            <motion.div
                                whileHover={{ y: -5, borderColor: 'rgba(212,165,116,0.5)' }}
                                className="p-6 bg-card-bg/50 backdrop-blur-sm rounded-2xl border border-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="text-primary" size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Hours</h3>
                                <div className="text-gray-400 text-sm">
                                    <p className="mb-1">
                                        <span className="text-white">Mon-Fri:</span> {contact?.hours?.weekdays || '7:00 AM - 10:00 PM'}
                                    </p>
                                    <p>
                                        <span className="text-white">Sat-Sun:</span> {contact?.hours?.weekends || '8:00 AM - 11:00 PM'}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Google Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="sticky top-24"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                            <iframe
                                src={mapSrc}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
                                title="Cafe De Meet Location"
                            ></iframe>
                            
                            {/* Map Overlay */}
                            <div className="absolute inset-0 pointer-events-none border-4 border-primary/20 rounded-2xl group-hover:border-primary/40 transition-colors duration-300"></div>
                            
                            {/* Get Directions Button */}
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(212,165,116,0.6)]"
                            >
                                Get Directions
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Location;
