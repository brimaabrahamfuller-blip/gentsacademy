/* ===========================
   SUPABASE CONFIGURATION
   =========================== */

// NOTE: Replace with your actual Supabase project details
const SUPABASE_CONFIG = {
    projectUrl: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_ANON_KEY'
};

// jsPDF CDN URL (for certificate generation)
const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

// Supabase JS Client CDN URL
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.1/+esm';

// Application settings
const APP_CONFIG = {
    appName: 'GentsAcademy',
    appVersion: '1.0.0',
    supportEmail: 'support@gentsacademy.com',
    defaultLocale: 'en-US'
};

// API endpoints (future use for backend)
const API_ENDPOINTS = {
    courses: '/api/courses',
    enrollments: '/api/enrollments',
    progress: '/api/progress',
    certificates: '/api/certificates'
};
