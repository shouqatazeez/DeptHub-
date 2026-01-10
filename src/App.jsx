
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/FirebaseAuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentSignupPage from './pages/StudentSignupPage';
import ResourcesPage from './pages/ResourcesPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import FacultyDashboard from './pages/FacultyDashboard';

import { startKeepAlive, stopKeepAlive } from './supabase/keepAlive';

import './index.css';

function App() {

  useEffect(() => {
    startKeepAlive();

    return () => stopKeepAlive();
  }, []);
  return (

    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/student-signup" element={<StudentSignupPage />} />
            <Route path="/resources" element={<ResourcesPage />} />


            <Route path="/upload" element={<UploadPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />


            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="btn btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
