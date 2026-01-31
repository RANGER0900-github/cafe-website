/**
 * Ensures a URL is absolute by prepending https:// if no protocol is present.
 * Also handles mailto: correctly.
 * @param {string} url - The URL to format
 * @returns {string} - The formatted absolute URL
 */
export const formatExternalLink = (url) => {
    if (!url) return '';

    const trimmedUrl = url.trim();

    // Check if it's already an absolute URL or a special protocol
    if (/^(f|ht)tps?:\/\//i.test(trimmedUrl) || /^mailto:/i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    // Prepend https:// if it looks like a domain
    return `https://${trimmedUrl}`;
};
