import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FileText,
    Upload,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Trash2,
    Loader2,
    RefreshCw,
    BookOpen,
    Download
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import { supabase } from '../supabase/config';

const FacultyDashboard = () => {
    const { user, isApprovedFaculty, isFaculty, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const loadResources = async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('resources')
                .select('*')
                .eq('uploaded_by', user.uid)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setResources(data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading resources:', err);
            setError('Failed to load your resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.uid) {
            loadResources();
        }
    }, [user?.uid]);

    const handleDelete = async (resourceId, filePath) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        setActionLoading(prev => ({ ...prev, [resourceId]: true }));
        try {
            if (filePath) {
                await supabase.storage
                    .from('resources')
                    .remove([filePath]);
            }

            const { error: deleteError } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);

            if (deleteError) throw deleteError;

            setResources(prev => prev.filter(r => r.id !== resourceId));
        } catch (err) {
            console.error('Error deleting resource:', err);
            alert('Failed to delete resource');
        } finally {
            setActionLoading(prev => ({ ...prev, [resourceId]: false }));
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    const stats = {
        total: resources.length,
        approved: resources.filter(r => r.status === 'approved').length,
        pending: resources.filter(r => r.status === 'pending').length,
        totalDownloads: resources.reduce((sum, r) => sum + (r.downloads || 0), 0)
    };

    if (!isAuthenticated || (!isFaculty() && !isAdmin())) {
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
                        Only faculty members can access this dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (isFaculty() && !isApprovedFaculty() && !isAdmin()) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
                <div className="card p-8 text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                        Pending Approval
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        Your faculty account is pending approval. Please wait for an admin to approve your account.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                            Faculty Dashboard
                        </h1>
                        <p className="text-sm text-neutral-600">
                            Manage your uploaded resources
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadResources}
                            className="btn btn-outline"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link to="/upload" className="btn btn-primary">
                            <Upload className="w-4 h-4" />
                            Upload New
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <FileText className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                        <p className="text-xs text-neutral-600">Total Uploads</p>
                    </div>
                    <div className="card text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.approved}</p>
                        <p className="text-xs text-neutral-600">Approved</p>
                    </div>
                    <div className="card text-center">
                        <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
                        <p className="text-xs text-neutral-600">Pending</p>
                    </div>
                    <div className="card text-center">
                        <Download className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.totalDownloads}</p>
                        <p className="text-xs text-neutral-600">Total Downloads</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <div className="card">
                    <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                        Your Uploads
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">
                                No uploads yet
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Start by uploading your first resource
                            </p>
                            <Link to="/upload" className="btn btn-primary">
                                <Upload className="w-4 h-4" />
                                Upload Resource
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {resources.map(resource => (
                                <div
                                    key={resource.id}
                                    className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${resource.type === 'notes'
                                            ? 'bg-primary-100'
                                            : 'bg-secondary-100'
                                            }`}>
                                            <FileText className={`w-5 h-5 ${resource.type === 'notes' ? 'text-primary-600' : 'text-secondary-600'
                                                }`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-neutral-900 mb-1">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 mb-2">
                                                {resource.subject} • {resource.regulation} • Sem {resource.semester}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                                {getStatusBadge(resource.status)}
                                                <span>{formatFileSize(resource.file_size)}</span>
                                                <span className="flex items-center gap-1">
                                                    <Download className="w-3 h-3" />
                                                    {resource.downloads || 0} downloads
                                                </span>
                                                <span>
                                                    {new Date(resource.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:flex-shrink-0">
                                            {resource.file_url && (
                                                <a
                                                    href={resource.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline text-sm py-2 px-3"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(resource.id, resource.file_path)}
                                                disabled={actionLoading[resource.id]}
                                                className="btn bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 px-3"
                                            >
                                                {actionLoading[resource.id] ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
