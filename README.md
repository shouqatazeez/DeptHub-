# DeptHub

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=vercel)](https://depthub.vercel.app/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)

**Live Demo:** [https://depthub.vercel.app/](https://depthub.vercel.app/)

DeptHub is a modern web-based academic resource management system designed for Computer Science Engineering departments. It enables students to access, organize, and download study materials while allowing faculty to upload and share notes, previous year papers, and other educational resources—all in one centralized platform.

---

## Features

### User Authentication
- Secure registration, login, and logout using **Firebase Auth**.
- Role-based access control with distinct permissions for **Students**, **Faculty**, and **Admins**.
- Faculty approval workflow to ensure only verified instructors can upload resources.

### Resource Library
- Browse organized **notes** and **previous year question papers (PYQs)**.
- Filter resources by **regulation**, **semester**, and **subject**.
- Quick search functionality across all available materials.
- Download resources instantly as PDF files.

### Faculty Upload Portal
- Approved faculty can upload educational materials.
- Support for PDF files up to **10MB**.
- Automatic organization by regulation, semester, and subject.
- Resources stored securely using **Supabase Storage**.

### Admin Dashboard
- Complete user management system.
- Approve or reject faculty registration requests.
- Monitor and manage all uploaded resources.
- View platform statistics (users, resources, downloads).

### Student Access
- Self-registration for students.
- Browse and download approved resources.
- Search and filter to find relevant study materials quickly.

### Modern UI/UX
- Clean, responsive design optimized for all devices.
- Beautiful gradient themes and smooth animations.
- Intuitive navigation and user-friendly interface.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, Vite |
| **Styling** | TailwindCSS 4 |
| **Authentication** | Firebase Auth |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shouqatazeez/DeptHub.git
   cd DeptHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with your Firebase and Supabase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

---

## Project Structure

```
DeptHub/
├── public/                 # Static assets (logos, icons)
├── src/
│   ├── components/         # Reusable UI components (Navbar)
│   ├── context/            # React Context (Auth)
│   ├── data/               # Static data (regulations, semesters, subjects)
│   ├── firebase/           # Firebase configuration
│   ├── layouts/            # Layout components (MainLayout)
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── StudentSignupPage.jsx
│   │   ├── ResourcesPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── FacultyDashboard.jsx
│   ├── supabase/           # Supabase services
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
└── vercel.json             # Vercel deployment config
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Student** | Browse and download approved resources |
| **Faculty (Pending)** | Registered but awaiting admin approval |
| **Faculty (Approved)** | Upload resources, manage own uploads |
| **Admin** | Full access: manage users, approve faculty, moderate resources |

---

## Workflows

### For Students
1. Sign up with a student email
2. Browse resources or use filters
3. Download PDFs after logging in

### For Faculty
1. Sign up as faculty
2. Wait for admin approval
3. Upload study materials via the Upload Portal
4. Manage your uploaded resources

### For Admins
1. Access the Admin Dashboard
2. Approve pending faculty registrations
3. Monitor and moderate resources
4. Manage platform users

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Shouqat Azeez**
- GitHub: [@shouqatazeez](https://github.com/shouqatazeez)

---

## Acknowledgments

- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Firebase](https://firebase.google.com/) - Authentication
- [Supabase](https://supabase.com/) - Backend & Storage
- [Lucide Icons](https://lucide.dev/) - Icon Library
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
