import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import { collegeInfo } from '../data/dummyData';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);

            const wakeUpTimer = setTimeout(() => {
                setError('Server is waking up... please wait (this can take up to 60 seconds on free tier)');
            }, 5000);

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Login timed out after 60 seconds. Please try again.')), 60000);
            });

            const user = await Promise.race([
                login(email, password),
                timeoutPromise
            ]);

            clearTimeout(wakeUpTimer);
            setError('');

            if (user?.role === 'admin') {
                navigate('/admin');
            } else if (user?.role === 'faculty') {
                navigate('/upload');
            } else {
                navigate('/resources');
            }
        } catch (err) {
            console.error('Login error caught:', err);
            const errorMessage = err.message?.toLowerCase() || '';

            if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid credentials')) {
                setError('Invalid email or password. Please check and try again.');
            } else if (errorMessage.includes('email not confirmed')) {
                setError('Please confirm your email before logging in.');
            } else if (errorMessage.includes('user not found')) {
                setError('No account found with this email. Please sign up first.');
            } else if (errorMessage.includes('too many requests')) {
                setError('Too many failed attempts. Please try again later.');
            } else if (errorMessage.includes('timed out')) {
                setError('Login timed out. Server may be sleeping. Please try again in a few seconds.');
            } else {
                setError(err.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-6">
                        <div className="mb-6">
                            <img
                                src={collegeInfo.logo}
                                alt="DeptHub"
                                style={{ width: '180px', height: '180px' }}
                                className="object-contain mx-auto rounded-full bg-white/50 p-4 shadow-lg"
                            />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Sign in to access {collegeInfo.departmentShortName} resources
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                            For both students and faculty
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="label">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input className="input input-with-icon"
                                    placeholder="you@example.com"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    className="input input-with-icon input-with-icon-right"
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-neutral-200"></div>
                        <span className="text-xs text-neutral-500">new to DeptHub?</span>
                        <div className="flex-1 h-px bg-neutral-200"></div>
                    </div>

                    <div className="text-center text-xs text-neutral-600 mt-5 space-y-2">
                        <p>
                            New student?{' '}
                            <Link to="/student-signup" className="text-primary-600 hover:text-primary-700 font-medium">
                                Create an account
                            </Link>
                        </p>
                        <p className="text-neutral-500">
                            Faculty member?{' '}
                            <Link to="/signup" className="text-secondary-600 hover:text-secondary-700 font-medium">
                                Request faculty access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
