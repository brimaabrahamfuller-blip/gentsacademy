# GentsAcademy Platform - Quick Start Guide

## 📚 Platform Overview

GentsAcademy is a free online learning platform with 10 in-demand courses in Business, AI, and Technology. All content is free, and students can earn certificates upon completion.

---

## 🚀 Getting Started

### 1. **View the Landing Page**
   - Open `index.html` in your browser
   - Features hero section, course showcase, testimonials, and value propositions

### 2. **Browse Courses**
   - Click "Explore Courses" or navigate to `courses.html`
   - Search for courses and filter by category (Business, AI, Technology, Combined)
   - Sort by popularity, rating, or duration

### 3. **Sign Up / Login**
   - Click "Sign Up Free" or "Login"
   - Go to `auth.html`
   - New users: Create account with email and password (8+ characters)
   - Existing users: Login with your credentials

### 4. **Take a Course**
   - From courses page, click "Explore Course"
   - View course details, learning outcomes, and curriculum
   - Click "Enroll Now" to start the course (requires login)
   - Watch videos, read materials, and mark modules complete

### 5. **Student Dashboard**
   - Go to `dashboard.html` after login
   - Track progress in enrolled courses
   - View and download earned certificates
   - Manage account settings

### 6. **Admin Dashboard** (Password Protected)
   - Navigate to `admin.html`
   - Enter password: `GentsAdmin2025`
   - Manage courses, view students, issue certificates
   - Monitor system statistics and activity

---

## 📂 File Structure

```
gents-academy/
├── index.html                    # Landing page
├── courses.html                  # Course catalogue
├── course-detail.html            # Individual course page
├── dashboard.html                # Student dashboard
├── auth.html                     # Login/Register
├── admin.html                    # Admin dashboard
├── css/
│   ├── style.css                # Main stylesheet with design system
│   ├── dashboard.css            # Dashboard styles
│   └── admin.css                # Admin styles
├── js/
│   ├── config.js                # Configuration and API settings
│   ├── main.js                  # Core utilities and auth helpers
│   ├── auth.js                  # Login/Register logic
│   ├── courses.js               # Courses page logic
│   ├── course-detail.js         # Course detail page logic
│   ├── dashboard.js             # Dashboard functionality
│   ├── certificate.js           # Certificate generation
│   └── admin.js                 # Admin dashboard logic
├── data/
│   └── courses.json             # All course data with modules
└── assets/
    └── images/                  # Images folder
```

---

## 🎓 10 Courses Included

1. **Business Fundamentals & Entrepreneurship** (6 weeks, Beginner)
2. **Digital Marketing & Social Media Management** (6 weeks, Intermediate)
3. **Financial Literacy & Accounting Basics** (5 weeks, Beginner)
4. **Introduction to Artificial Intelligence** (5 weeks, Beginner)
5. **Prompt Engineering & Working with AI Tools** (4 weeks, Intermediate)
6. **Web Development (HTML, CSS, JavaScript)** (8 weeks, Beginner)
7. **Data Entry & Microsoft Office Productivity** (4 weeks, Beginner)
8. **Graphic Design Fundamentals (Canva + Figma)** (6 weeks, Beginner)
9. **Cybersecurity Awareness & Digital Safety** (4 weeks, Beginner)
10. **Business + AI Combined: Running a Smart Business** (7 weeks, Intermediate)

---

## 🎨 Design System

### Colors
- **Primary Background:** #0A0A0F (Deep Dark)
- **Surface Cards:** #12121A (Dark Secondary)
- **Navy Accent:** #0D1B4B (Professional Navy)
- **Gold Accent:** #C9A84C (Premium Gold)
- **Text Primary:** #F5F5F5 (White)
- **Text Secondary:** #9A9AB0 (Muted)

### Typography
- **Headings:** Playfair Display (serif)
- **Body/UI:** Inter (sans-serif)
- **Premium, modern dark theme inspired by Coursera + Apple**

---

## 🔐 Authentication

### Demo Account
- **Email:** demo@example.com
- **Password:** password123

### How It Works
- Users create accounts via registration form
- Sessions stored in localStorage (demo implementation)
- Admin password: `GentsAdmin2025`
- In production, integrate with Supabase for real authentication

---

## 📊 Features

### For Students
✅ Browse and search courses  
✅ Enroll in courses (free)  
✅ Watch embedded YouTube lectures  
✅ Access downloadable resources  
✅ Track progress with module completion  
✅ Earn and download certificates  
✅ Manage account and preferences  

### For Admins
✅ View system statistics  
✅ Manage courses (add/edit/delete)  
✅ Monitor enrolled students  
✅ Manage certificates  
✅ View recent activity  

---

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop:** Full layout with sidebar support
- **Tablet:** Optimized grid layouts
- **Mobile:** Single column, touch-friendly interactions

---

## 🎯 Key Technologies

- **HTML5** - Semantic markup
- **CSS3** - Variables, Flexbox, CSS Grid
- **Vanilla JavaScript** - No frameworks
- **Local Storage** - Session management (demo)
- **Canvas API** - Certificate generation
- **YouTube Embeds** - Video content

---

## 🔄 Data Flow

### Course Progress
1. Student enrolls in course → stored in localStorage
2. Student completes modules → progress tracked
3. All modules completed → certificate auto-generated
4. Certificate available for download

### Certificates
- Generated with student name, course, completion date
- Unique certificate ID for verification
- Downloadable as image/PDF
- Can be shared on social media

---

## 🛠️ Customization

### Change Admin Password
Edit `js/admin.js` line 10:
```javascript
const ADMIN_PASSWORD = 'YourNewPassword';
```

### Update Course Content
Edit `data/courses.json` to add/modify courses

### Customize Colors
Edit CSS variables in `css/style.css` `:root` section

### Change Branding
- Update logo in assets folder
- Modify brand text in navigation

---

## ⚙️ Production Deployment

### Setup Supabase Integration
1. Create Supabase project at supabase.com
2. Update credentials in `js/config.js`
3. Replace localStorage with Supabase calls in:
   - `js/auth.js`
   - `js/dashboard.js`
   - `js/admin.js`

### Enable jsPDF for Certificates
Include jsPDF CDN in HTML files:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Deploy Platform
- Host on Vercel, Netlify, or traditional web server
- Ensure all paths are relative
- Test on multiple devices

---

## 📞 Support

For questions or issues:
- Review the codebase comments
- Check individual file headers for function documentation
- Test in browser DevTools (F12)

---

## 📄 License

GentsAcademy - Built for Liberia's Future 🇱🇷

**Made with 💙 for free education**
