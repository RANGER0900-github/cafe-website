import { motion } from 'framer-motion';

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 border-2 border-secondary rounded-full flex items-center justify-center"
                >
                    <div className="w-8 h-8 bg-primary rounded-full blur-md"></div>
                </motion.div>
                <span className="font-display font-bold text-xl tracking-widest text-white animate-pulse">
                    LOADING ASSETS
                </span>
            </div>
        </motion.div>
    );
};

export default Preloader;
