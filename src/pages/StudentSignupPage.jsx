import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import { collegeInfo, regulations, semesters } from '../data/dummyData';

const StudentSignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        regulation: 'R20',
        semester: '1-1',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);

            const wakeUpTimer = setTimeout(() => {
                setError('Server is waking up... please wait (this can take up to 60 seconds on free tier)');
            }, 5000);

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Signup timed out. Please try again.')), 60000);
            });

            await Promise.race([
                signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'student',
                    regulation: formData.regulation,
                    semester: formData.semester,
                }),
                timeoutPromise
            ]);

            clearTimeout(wakeUpTimer);
            setError('');
            navigate('/resources');
        } catch (err) {
            const errorMessage = err.message?.toLowerCase() || '';

            if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
                setError('An account with this email already exists. Please login instead.');
            } else if (errorMessage.includes('invalid email')) {
                setError('Invalid email address format.');
            } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
                setError('Password is too weak. Please use at least 6 characters.');
            } else if (errorMessage.includes('signup is disabled')) {
                setError('Signup is currently disabled. Please contact support.');
            } else if (errorMessage.includes('timed out')) {
                setError('Signup timed out. Server may be sleeping. Please try again.');
            } else {
                setError(err.message || 'Signup failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-5">
                        <div className="mb-5">
                            <img
                                src={collegeInfo.logo}
                                alt="DeptHub"
                                style={{ width: '150px', height: '150px' }}
                                className="object-contain mx-auto rounded-full bg-white/50 p-3 shadow-lg"
                            />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900 mb-1">
                            Student Registration
                        </h1>
                        <p className="text-sm text-neutral-600">
                            Create an account to download {collegeInfo.departmentShortName} resources
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="label">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="input input-left-icon"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                College Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@college.edu"
                                    className="input input-left-icon"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="regulation" className="label">
                                    Regulation
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <select
                                        id="regulation"
                                        name="regulation"
                                        value={formData.regulation}
                                        onChange={handleChange}
                                        className="select input-left-icon"
                                        disabled={isLoading}
                                    >
                                        {regulations.map(reg => (
                                            <option key={reg.id} value={reg.id}>{reg.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="semester" className="label">
                                    Semester
                                </label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <select
                                        id="semester"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="select input-left-icon"
                                        disabled={isLoading}
                                    >
                                        {semesters.map(sem => (
                                            <option key={sem.id} value={sem.id}>{sem.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input input-left-icon input-right-icon"
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
                            <p className="text-xs text-neutral-500 mt-1">
                                At least 6 characters
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="label">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input input-left-icon"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-2.5 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="w-4 h-4" />
                                    Create Student Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-600 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in here
                        </Link>
                    </p>

                    <p className="text-center text-xs text-neutral-500 mt-3">
                        Are you a faculty member?{' '}
                        <Link to="/signup" className="text-secondary-600 hover:text-secondary-700 font-medium">
                            Register as Faculty
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentSignupPage;
