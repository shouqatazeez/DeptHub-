import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    LogOut,
    User,
    BookOpen,
    Upload,
    Shield,
    Home,
    ChevronDown,
    FileText
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import { collegeInfo } from '../data/dummyData';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAuthenticated, isAdmin, isApprovedFaculty } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    const getNavItems = () => {
        const items = [
            { path: '/', label: 'Home', icon: Home },
            { path: '/resources', label: 'Resources', icon: BookOpen },
        ];

        if (isApprovedFaculty()) {
            items.push({ path: '/upload', label: 'Upload', icon: Upload });
            items.push({ path: '/faculty-dashboard', label: 'My Uploads', icon: FileText });
        }

        if (isAdmin()) {
            items.push({ path: '/admin', label: 'Admin', icon: Shield });
        }

        return items;
    };

    const navItems = getNavItems();

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="container">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center group">
                        <img
                            src="/depthub-logo.png"
                            alt="DeptHub"
                            style={{ height: '80px' }}
                            className="object-contain rounded-2xl group-hover:scale-105 transition-transform"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-neutral-700">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 animate-slideUp">
                                        <div className="px-4 py-3 border-b border-neutral-100">
                                            <p className="font-medium text-neutral-900">{user.name}</p>
                                            <p className="text-sm text-neutral-500">{user.email}</p>
                                            <span className={`inline-block mt-2 badge ${user.role === 'admin' ? 'badge-primary' :
                                                user.role === 'faculty' ?
                                                    (user.status === 'approved' ? 'badge-success' : 'badge-warning') :
                                                    'badge-secondary'
                                                }`}>
                                                {user.role === 'faculty' && user.status === 'pending'
                                                    ? 'Pending Approval'
                                                    : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="btn btn-ghost text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn btn-primary text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200 animate-slideUp">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
