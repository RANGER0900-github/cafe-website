import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const handleNav = (e, href) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const links = [
        { name: 'Menu', href: '#menu' },
        { name: 'Specials', href: '#specials' },
        { name: 'Location', href: '#location' },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6"
        >
            <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl w-full max-w-5xl">
                <Link to="/" className="font-display font-bold text-xl tracking-tighter text-white">
                    CAFE DE MEET<span className="text-primary">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/menu" className="text-sm font-medium hover:text-primary transition-colors relative group">
                        <span className="relative z-10">Full Menu</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNav(e, link.href)}
                            className="text-sm font-medium hover:text-primary transition-colors relative group cursor-pointer"
                        >
                            <span className="relative z-10">{link.name}</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                        </a>
                    ))}
                    <a
                        href="#location"
                        onClick={(e) => handleNav(e, '#location')}
                        className="bg-primary/10 text-primary border border-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-black transition-all"
                    >
                        Visit Us
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-24 left-6 right-6 bg-card-bg border border-primary/20 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl md:hidden"
                >
                    <Link to="/menu" className="text-lg font-medium text-center py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                        Full Menu
                    </Link>
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-center py-2 hover:text-primary"
                            onClick={(e) => handleNav(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
