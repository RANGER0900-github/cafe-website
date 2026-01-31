import { createContext, useContext, useState, useEffect } from 'react';
import { useContent } from './ContentContext';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { loading: contentLoading } = useContent();

    useEffect(() => {
        // Wait for content to confirm which images we even NEED to load
        if (contentLoading) return;

        const imagesToPreload = [
            '/images/mishwa_portrait.png',
            '/images/reel_thumbnail_1.png',
            '/images/reel_thumbnail_2.png',
            '/images/reel_thumbnail_3.png',
            '/images/reel_thumbnail_4.png',
            '/images/cinematic_thumbnail_1.png'
        ];

        let loadedCount = 0;

        const checkLoad = () => {
            loadedCount++;
            if (loadedCount === imagesToPreload.length) {
                // Add a small buffer for smooth exit
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = checkLoad;
            img.onerror = checkLoad; // Proceed even if one fails
        });

        // Fallback in case loading hangs
        const timeout = setTimeout(() => setIsLoading(false), 5000);

        return () => clearTimeout(timeout);
    }, [contentLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
