import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContent = async () => {
        try {
            const response = await fetch('/api/content');
            if (!response.ok) throw new Error('Failed to fetch content');
            const data = await response.json();
            setContent(data);
        } catch (err) {
            console.error("Content Fetch Error:", err);
            setError(err);
            // Fallback to local data if API fails (optional, but good for robustness)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const updateContent = async (newContent) => {
        // Optimistic update
        const oldContent = content;
        setContent(newContent);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(newContent)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }
        } catch (err) {
            console.error("Update Failed:", err);
            setContent(oldContent); // Revert on failure
            throw err; // Propagate to caller for toast
        }
    };

    return (
        <ContentContext.Provider value={{ content, loading, error, updateContent, refresh: fetchContent }}>
            {children}
        </ContentContext.Provider>
    );
};
