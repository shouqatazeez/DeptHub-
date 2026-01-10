import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Upload,
    FileText,
    FileQuestion,
    AlertCircle,
    CheckCircle,
    Info,
    Clock,
    File,
    X,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import {
    regulations,
    semesters,
    getSubjectsByRegulationAndSemester
} from '../data/dummyData';
import { uploadFile, createResource } from '../supabase/resourceService';

const UploadPage = () => {
    const { user, isApprovedFaculty, isFaculty, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        regulation: '',
        semester: '',
        subject: '',
        type: 'notes',
    });
    const [file, setFile] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const availableSubjects = useMemo(() => {
        if (!formData.regulation || !formData.semester) {
            return [];
        }
        return getSubjectsByRegulationAndSemester(formData.regulation, formData.semester);
    }, [formData.regulation, formData.semester]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === 'regulation' || name === 'semester') {
                newData.subject = '';
            }

            return newData;
        });

        if (error) setError('');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setError('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const removeFile = () => {
        setFile(null);
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Please enter a title');
            return false;
        }
        if (!formData.regulation) {
            setError('Please select a regulation');
            return false;
        }
        if (!formData.semester) {
            setError('Please select a semester');
            return false;
        }
        if (!formData.subject) {
            setError('Please select a subject');
            return false;
        }
        if (!file) {
            setError('Please select a PDF file to upload');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const filePath = `${formData.regulation}/${formData.semester}/${formData.subject}`;
            const uploadResult = await uploadFile(file, filePath);

            await createResource({
                title: formData.title,
                description: `${formData.type === 'notes' ? 'Study notes' : 'Previous year questions'} for ${formData.subject}`,
                type: formData.type,
                regulation: formData.regulation,
                semester: formData.semester,
                subject: formData.subject,
                file_url: uploadResult.url,
                file_name: uploadResult.fileName,
                file_size: uploadResult.fileSize,
            }, user);

            setSuccess(true);

            setTimeout(() => {
                setFormData({
                    title: '',
                    regulation: '',
                    semester: '',
                    subject: '',
                    type: 'notes',
                });
                setFile(null);
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (!isFaculty() && !isAdmin()) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
                <div className="card p-8 text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                        Access Denied
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Only faculty members can upload resources. If you're a faculty member, please sign up for an account.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="btn btn-primary"
                    >
                        Register as Faculty
                    </button>
                </div>
            </div>
        );
    }

    if (!isApprovedFaculty() && !isAdmin()) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
                <div className="card p-8 text-center max-w-md animate-slideUp">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                        Pending Approval
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Your account is waiting for admin approval. You'll be able to upload resources once your account is approved.
                    </p>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-left">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">What happens next?</p>
                                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                                    <li>• An admin will review your registration</li>
                                    <li>• You'll get upload access once approved</li>
                                    <li>• Contact your department for faster approval</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-500 mt-6">
                        Account Status: <span className="badge badge-warning">Pending</span>
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline mt-4"
                    >
                        <BookOpen className="w-4 h-4" />
                        Refresh Status
                    </button>
                    <p className="text-xs text-neutral-400 mt-2">
                        Already approved? Click refresh to update your status.
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
                <div className="card p-8 text-center max-w-md animate-slideUp">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                        Upload Successful!
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Your resource has been uploaded and is now available for students to download.
                    </p>
                    <p className="text-sm text-neutral-500">
                        The form will reset shortly...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                        Upload Resource
                    </h1>
                    <p className="text-sm text-neutral-600">
                        Share academic materials with students. Uploading as: <span className="font-medium">{user?.name}</span>
                    </p>
                </div>

                <div className="card">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="label">
                                Resource Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Complete Unit 1 Notes"
                                className="input"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-neutral-500 mt-1">
                                Use a descriptive title that helps students find this resource
                            </p>
                        </div>

                        <div>
                            <label className="label">Resource Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'type', value: 'notes' } })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'notes'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <FileText className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'notes' ? 'text-primary-600' : 'text-neutral-400'
                                        }`} />
                                    <p className={`font-medium ${formData.type === 'notes' ? 'text-primary-700' : 'text-neutral-700'
                                        }`}>Notes</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Study materials & notes
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'type', value: 'pyq' } })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'pyq'
                                        ? 'border-secondary-500 bg-secondary-50'
                                        : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <FileQuestion className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'pyq' ? 'text-secondary-600' : 'text-neutral-400'
                                        }`} />
                                    <p className={`font-medium ${formData.type === 'pyq' ? 'text-secondary-700' : 'text-neutral-700'
                                        }`}>Previous Year Papers</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Past exam questions
                                    </p>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="regulation" className="label">
                                    Regulation
                                </label>
                                <select
                                    id="regulation"
                                    name="regulation"
                                    value={formData.regulation}
                                    onChange={handleChange}
                                    className="select"
                                    disabled={isLoading}
                                >
                                    <option value="">Select Regulation</option>
                                    {regulations.map(reg => (
                                        <option key={reg.id} value={reg.id}>
                                            {reg.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="semester" className="label">
                                    Semester
                                </label>
                                <select
                                    id="semester"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="select"
                                    disabled={isLoading}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(sem => (
                                        <option key={sem.id} value={sem.id}>
                                            Year {sem.year} - Sem {sem.sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="label">
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="select"
                                disabled={isLoading || !formData.regulation || !formData.semester}
                            >
                                <option value="">
                                    {!formData.regulation || !formData.semester
                                        ? 'Select regulation & semester first'
                                        : 'Select Subject'}
                                </option>
                                {availableSubjects.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.code} - {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Upload PDF</label>

                            {file ? (
                                <div className="p-4 rounded-xl border-2 border-primary-200 bg-primary-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <File className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-neutral-900 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-2 rounded-lg hover:bg-primary-100 text-neutral-500 hover:text-red-600 transition-colors"
                                            disabled={isLoading}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="block p-8 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50/50 transition-colors cursor-pointer text-center">
                                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                    <p className="font-medium text-neutral-700 mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        PDF files only, max 10MB
                                    </p>
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-blue-800">Upload Guidelines</p>
                                    <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                                        <li>• Only upload educational materials you have rights to share</li>
                                        <li>• Ensure content is accurate and helpful for students</li>
                                        <li>• Use clear, descriptive titles for easy discovery</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-2.5 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload Resource
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
