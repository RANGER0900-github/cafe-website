import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
const supabaseUrl = 'https://kgramjutjldqiabjzrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncmFtanV0amxkcWlhYmp6cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Nzc5MTQsImV4cCI6MjA4NTM1MzkxNH0.64MuU43xWF6LTqpW1nhkoo30erziUtkf8-eoW9mtkjM';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Trust proxy for production
app.set('trust proxy', true);

// =====================
// SECURITY MIDDLEWARE
// =====================

// =====================
// SECURITY MIDDLEWARE
// =====================

// Rate limiting store
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // max requests per window
const BLOCKED_IPS = new Set();

const SECURITY_PATTERNS = [
    // XSS - Only match actual script tags, not URLs
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    // More specific javascript: check - only in onclick, onerror, etc attributes
    /on\w+\s*=\s*['"]*javascript:/gi,
    // Path Traversal 
    /(\.\.\/|\.\.\\)/g
];

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Rate limiter
const rateLimiter = (req, res, next) => {
    const ip = getClientIP(req);

    if (BLOCKED_IPS.has(ip)) {
        logNotification('attack_blocked', 'Blocked IP Attempt', `Blocked request from banned IP: ${ip}`, ip);
        return res.status(403).json({ error: 'Access denied' });
    }

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }

    const requests = rateLimitStore.get(ip).filter(time => time > windowStart);
    requests.push(now);
    rateLimitStore.set(ip, requests);

    if (requests.length > RATE_LIMIT_MAX) {
        logNotification('attack_blocked', 'Rate Limit Exceeded', `IP ${ip} exceeded rate limit`, ip);
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    next();
};

// Check if request is authenticated (has admin token)
const isAuthenticated = (req) => {
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;
    if (!token) return false;
    // Tokens start with 'admin-token-' that we generate in login
    return token.startsWith('admin-token-') && token.length > 20;
};

// Input sanitizer - Smart version that allows common content
const sanitizeInput = (req, res, next) => {
    const ip = getClientIP(req);
    
    // Skip sanitization for authenticated admin requests and for /api/track endpoints
    const skipEndpoints = ['/api/track', '/api/track/heartbeat', '/api/track/reel', '/api/login'];
    if (isAuthenticated(req) || skipEndpoints.includes(req.path)) {
        return next();
    }
    
    const checkString = (str, path) => {
        if (typeof str !== 'string') return false;
        const matchedPattern = SECURITY_PATTERNS.find(pattern => {
            const isMatch = pattern.test(str);
            if (pattern.global) pattern.lastIndex = 0;
            return isMatch;
        });

        if (matchedPattern) {
            console.warn(`[SECURITY] Blocked suspicious input in ${path} from IP: ${ip}`);
            console.warn(`[SECURITY] Matched Pattern: ${matchedPattern}`);
            console.warn(`[SECURITY] Value: ${str.substring(0, 500)}`);
            logNotification('attack_blocked', 'Malicious Input Blocked', `Suspicious pattern detected in ${path} from IP: ${ip}`, ip);
            return true;
        }
        return false;
    };

    const checkObject = (obj, path = '') => {
        if (!obj || typeof obj !== 'object') return false;
        for (const key in obj) {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof value === 'string' && checkString(value, currentPath)) {
                return true;
            }
            if (typeof value === 'object' && value !== null) {
                if (checkObject(value, currentPath)) return true;
            }
        }
        return false;
    };

    // Only check body and query, skip params which might have URLs
    if (checkObject(req.body) || checkObject(req.query)) {
        return res.status(400).json({ error: 'Invalid input detected. Please avoid using script tags or known attack patterns.' });
    }

    next();
};

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(rateLimiter);
app.use(sanitizeInput);

// Helper to read/write local DB
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (err) {
        return { auth: {}, content: {}, analytics: { visits: [], notifications: [] } };
    }
};
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Initialize notifications array if not exists
const initializeDB = () => {
    const db = readDB();
    if (!db.notifications) db.notifications = [];
    if (!db.analytics) db.analytics = { visits: [], reelClicks: {} };
    writeDB(db);
};
initializeDB();

// Log notification helper
const logNotification = (type, title, message, ip = null) => {
    try {
        const db = readDB();
        if (!db.notifications) db.notifications = [];

        const notification = {
            id: crypto.randomUUID(),
            type,
            title,
            message,
            ip,
            timestamp: new Date().toISOString(),
            read: false
        };

        db.notifications.unshift(notification);
        // Keep only last 500 notifications
        if (db.notifications.length > 500) {
            db.notifications = db.notifications.slice(0, 500);
        }
        writeDB(db);
    } catch (err) {
        console.error('Failed to log notification:', err);
    }
};

// Get real client IP
const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIP = req.headers['x-real-ip'];
    if (realIP) return realIP;
    const cfIP = req.headers['cf-connecting-ip'];
    if (cfIP) return cfIP;
    return req.ip || req.socket?.remoteAddress || 'Unknown';
};

// Fetch geolocation
const fetchGeoData = async (ip) => {
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
            country: 'Localhost', city: 'Development Machine', region: 'Local',
            latitude: 0, longitude: 0, isp: 'Localhost',
            isVpn: false, connectionType: 'ethernet',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName,lat,lon,isp,mobile,proxy,hosting,timezone`);
        const data = await response.json();
        if (data.status === 'success') {
            return {
                country: data.country || 'Unknown', city: data.city || 'Unknown',
                region: data.regionName || 'Unknown', latitude: data.lat || 0,
                longitude: data.lon || 0, isp: data.isp || 'Unknown',
                isVpn: data.proxy || data.hosting || false,
                connectionType: data.mobile ? 'cellular' : 'wifi',
                timezone: data.timezone || 'Unknown'
            };
        }
    } catch (error) {
        console.error('Geolocation API error:', error);
    }
    return { country: 'Unknown', city: 'Unknown', region: 'Unknown', latitude: 0, longitude: 0, isp: 'Unknown', isVpn: false, connectionType: 'unknown', timezone: 'Unknown' };
};

const getDeviceType = (userAgent) => {
    if (!userAgent) return 'unknown';
    if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
    return 'desktop';
};

// =====================
// API ROUTES
// =====================

// Get Content
app.get('/api/content', (req, res) => {
    try {
        const db = readDB();
        res.json(db.content);
    } catch (error) {
        logNotification('error', 'Content Read Error', error.message);
        res.status(500).json({ error: 'Failed to read content' });
    }
});

// Update Content
app.post('/api/content', (req, res) => {
    try {
        const db = readDB();
        db.content = { ...db.content, ...req.body };
        writeDB(db);
        logNotification('info', 'Content Updated', 'Website content was modified via CMS');
        res.json({ success: true, content: db.content });
    } catch (error) {
        logNotification('error', 'Content Update Error', error.message);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Image Upload to Supabase Storage
app.post('/api/upload', async (req, res) => {
    try {
        const { file, filename, type } = req.body;

        if (!file || !filename) {
            return res.status(400).json({ error: 'File and filename required' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (type && !allowedTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        // Decode base64
        const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate unique filename
        const ext = filename.split('.').pop() || 'png';
        const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(uniqueName, buffer, {
                contentType: type || 'image/png',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ error: 'Upload failed: ' + error.message });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(uniqueName);

        logNotification('info', 'Image Uploaded', `New image uploaded: ${uniqueName}`);
        res.json({ success: true, url: urlData.publicUrl, filename: uniqueName });
    } catch (error) {
        logNotification('error', 'Upload Error', error.message);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Login with security logging
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = readDB();
        const ip = getClientIP(req);

        if (username === db.auth.username && password === db.auth.password) {
            logNotification('security', 'Login Success', `Admin login from IP: ${ip}`, ip);
            res.json({ success: true, token: 'admin-token-' + crypto.randomBytes(16).toString('hex') });
        } else {
            logNotification('warning', 'Failed Login Attempt', `Failed login attempt from IP: ${ip} with username: ${username}`, ip);
            res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Track Visitor
app.post('/api/track', async (req, res) => {
    try {
        const { userAgent, pageViewed, reelId } = req.body;
        const clientIP = getClientIP(req);
        const geoData = await fetchGeoData(clientIP);
        const deviceType = getDeviceType(userAgent);

        const visitorData = {
            ip: clientIP,
            user_agent: userAgent || 'Unknown',
            device_type: deviceType,
            country: geoData.country,
            city: geoData.city,
            region: geoData.region,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            isp: geoData.isp,
            is_vpn: geoData.isVpn,
            connection_type: geoData.connectionType,
            timezone: geoData.timezone,
            page_viewed: pageViewed || '/',
            reel_id: reelId || null,
            session_duration: 0
        };

        const { data, error } = await supabase.from('visitors').insert([visitorData]).select().single();

        if (error) {
            const db = readDB();
            const localVisit = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...visitorData };
            db.analytics.visits.push(localVisit);
            writeDB(db);
            return res.json({ success: true, visitId: localVisit.id, source: 'local' });
        }

        res.json({ success: true, visitId: data.id, source: 'supabase' });
    } catch (error) {
        console.error("Tracking Error:", error);
        res.json({ success: false });
    }
});

// Session Heartbeat
app.post('/api/track/heartbeat', async (req, res) => {
    try {
        const { visitId, duration } = req.body;
        if (!visitId) return res.json({ success: false });

        const { error } = await supabase.from('visitors').update({ session_duration: duration }).eq('id', visitId);

        if (error) {
            const db = readDB();
            const idx = db.analytics.visits.findIndex(v => v.id === visitId);
            if (idx !== -1) {
                db.analytics.visits[idx].session_duration = duration;
                writeDB(db);
            }
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

// Track Reel Click
app.post('/api/track/reel', async (req, res) => {
    try {
        const { reelId, visitId } = req.body;
        const db = readDB();
        if (!db.analytics.reelClicks) db.analytics.reelClicks = {};
        db.analytics.reelClicks[reelId] = (db.analytics.reelClicks[reelId] || 0) + 1;
        if (visitId) {
            await supabase.from('visitors').update({ reel_id: reelId }).eq('id', visitId);
        }
        writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

// Get Analytics
app.get('/api/analytics', async (req, res) => {
    try {
        const { data: supabaseVisits, error } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(500);
        const db = readDB();

        const visits = (supabaseVisits || []).map(v => ({
            id: v.id, timestamp: v.created_at, ip: v.ip, userAgent: v.user_agent,
            deviceType: v.device_type, country: v.country, city: v.city,
            region: v.region, latitude: v.latitude, longitude: v.longitude,
            isp: v.isp, isVpn: v.is_vpn, connectionType: v.connection_type,
            timezone: v.timezone, pageViewed: v.page_viewed, reelId: v.reel_id,
            sessionDuration: v.session_duration
        }));

        const total = visits.length;
        const unique = new Set(visits.map(v => v.ip)).size;
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = visits.filter(v => v.timestamp?.startsWith(today)).length;

        const countries = {};
        visits.forEach(v => { if (v.country) countries[v.country] = (countries[v.country] || 0) + 1; });

        const devices = { mobile: 0, desktop: 0 };
        visits.forEach(v => { if (v.deviceType === 'mobile') devices.mobile++; else devices.desktop++; });

        res.json({
            visits, reelClicks: db.analytics?.reelClicks || {},
            stats: { total_visitors: total, unique_visitors: unique, today: todayCount, countries, devices }
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        const db = readDB();
        res.json(db.analytics);
    }
});

// =====================
// NOTIFICATIONS API
// =====================

app.get('/api/notifications', (req, res) => {
    try {
        const db = readDB();
        res.json({ notifications: db.notifications || [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

app.post('/api/notifications/:id/read', (req, res) => {
    try {
        const db = readDB();
        const idx = db.notifications.findIndex(n => n.id === req.params.id);
        if (idx !== -1) {
            db.notifications[idx].read = true;
            writeDB(db);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});

app.delete('/api/notifications/:id', (req, res) => {
    try {
        const db = readDB();
        db.notifications = db.notifications.filter(n => n.id !== req.params.id);
        writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

app.post('/api/notifications/clear', (req, res) => {
    try {
        const db = readDB();
        db.notifications = [];
        writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear notifications' });
    }
});

// Settings - Update Password
app.post('/api/settings/password', (req, res) => {
    try {
        const db = readDB();
        const { username, newPassword } = req.body;
        const ip = getClientIP(req);

        if (username === db.auth.username) {
            db.auth.password = newPassword;
            writeDB(db);
            logNotification('security', 'Password Changed', `Admin password was changed from IP: ${ip}`, ip);
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Invalid username' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Settings - Clear Analytics
app.post('/api/settings/clear-analytics', async (req, res) => {
    try {
        await supabase.from('visitors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const db = readDB();
        db.analytics = { visits: [], ip_logs: [], reelClicks: {}, stats: { total_visitors: 0, unique_visitors: 0, countries: {}, devices: { mobile: 0, desktop: 0 } } };
        writeDB(db);
        logNotification('info', 'Analytics Cleared', 'All analytics data was cleared');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear analytics' });
    }
});

// Clean up rate limit store periodically
setInterval(() => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    for (const [ip, requests] of rateLimitStore.entries()) {
        const validRequests = requests.filter(time => time > windowStart);
        if (validRequests.length === 0) {
            rateLimitStore.delete(ip);
        } else {
            rateLimitStore.set(ip, validRequests);
        }
    }
}, 60000);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔒 Security middleware active (rate limiting, XSS protection)`);
    console.log(`📊 Analytics API: /api/analytics`);
    console.log(`🔔 Notifications API: /api/notifications`);
    console.log(`🌐 Supabase connected: ${supabaseUrl}`);
});
