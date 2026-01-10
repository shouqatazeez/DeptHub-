import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    UserPlus,
    AlertCircle,
    CheckCircle,
    Info
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import { collegeInfo } from '../data/dummyData';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'Computer Science',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) return setError('Please enter your name'), false;
        if (!formData.email.includes('@')) return setError('Enter a valid email'), false;
        if (formData.password.length < 6) return setError('Password must be at least 6 characters'), false;
        if (formData.password !== formData.confirmPassword)
            return setError('Passwords do not match'), false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
                    department: formData.department,
                    password: formData.password,
                    role: 'faculty',
                }),
                timeoutPromise
            ]);

            clearTimeout(wakeUpTimer);
            setError('');
            setSuccess(true);
            setTimeout(() => navigate('/upload'), 2000);
        } catch (err) {
            const errorMessage = err.message?.toLowerCase() || '';

            if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
                setError('An account with this email already exists. Please login instead.');
            } else if (errorMessage.includes('invalid email')) {
                setError('Invalid email address format.');
            } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
                setError('Password is too weak. Please use at least 6 characters.');
            } else if (errorMessage.includes('timed out')) {
                setError('Signup timed out. Server may be sleeping. Please try again.');
            } else {
                setError(err.message || 'Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <div className="card max-w-md text-center p-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Registration Successful</h2>
                    <p className="text-neutral-600 mb-5">
                        Your account is pending admin approval.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                            <p className="text-sm text-amber-700">
                                Please contact your department admin to get upload access.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-6">
                        <img
                            src={collegeInfo.logo}
                            alt="DeptHub"
                            style={{ width: '150px', height: '150px' }}
                            className="object-contain mx-auto mb-5 rounded-full bg-white/50 p-3 shadow-lg"
                        />
                        <h1 className="text-xl font-bold">Faculty Registration</h1>
                        <p className="text-sm text-neutral-600">
                            Request upload access for {collegeInfo.departmentShortName}
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
                        <div className="flex gap-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                            <p className="text-xs text-blue-700">
                                Admin approval is required before uploading resources.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Dr. John Doe"
                                    className="input input-left-icon"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">College Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="faculty@college.edu"
                                    className="input input-left-icon"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Department</label>
                            <div className="relative">
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="select select-left-icon"
                                >
                                    <option>Computer Science & Engineering</option>
                                    <option>Electronics & Communication</option>
                                    <option>Mechanical Engineering</option>
                                    <option>Civil Engineering</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input input-left-icon input-right-icon"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input input-left-icon"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-secondary w-full py-2.5"
                        >
                            <UserPlus className="w-4 h-4" />
                            Register as Faculty
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-600 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-medium">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-center text-xs text-neutral-500 mt-2">
                        Are you a student?{' '}
                        <Link to="/student-signup" className="text-primary-600 font-medium">
                            Register as Student
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
