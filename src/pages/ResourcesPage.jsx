import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    BookOpen,
    FileText,
    Clock,
    User,
    X,
    FileQuestion,
    AlertCircle,
    Loader2,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import {
    regulations,
    semesters,
    resources as dummyResources,
    getSubjectsByRegulationAndSemester
} from '../data/dummyData';
import { fetchResources, incrementDownloads, deleteResource } from '../supabase/resourceService';

const ResourcesPage = () => {
    const { isAuthenticated, user, isAdmin, isApprovedFaculty } = useAuth();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const [filters, setFilters] = useState({
        regulation: '',
        semester: '',
        subject: '',
        type: '',
        search: '',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading resources...');

    useEffect(() => {
        let isSubscribed = true;

        const loadResources = async (retryCount = 0) => {
            try {
                setLoading(true);
                if (retryCount > 0) {
                    setLoadingMessage(`Retrying... (attempt ${retryCount + 1})`);
                } else {
                    setLoadingMessage('Loading resources...');
                }

                const data = await fetchResources({
                    regulation: filters.regulation || undefined,
                    semester: filters.semester || undefined,
                    subject: filters.subject || undefined,
                    type: filters.type || undefined,
                    status: 'approved'
                });

                if (isSubscribed) {
                    setResources(data || []);
                    setError(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error loading resources:', err);

                if (retryCount < 2) {
                    setLoadingMessage('Server is waking up, please wait...');
                    setTimeout(() => loadResources(retryCount + 1), 2000);
                    return;
                }

                if (isSubscribed) {
                    setError('Failed to load resources. Please refresh the page.');
                    setResources(dummyResources);
                    setLoading(false);
                }
            }
        };

        loadResources();

        return () => {
            isSubscribed = false;
        };
    }, [filters.regulation, filters.semester, filters.subject, filters.type]);

    const updateFilter = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            if (key === 'regulation') {
                newFilters.subject = '';
            }
            if (key === 'semester') {
                newFilters.subject = '';
            }

            return newFilters;
        });
    };

    const clearFilters = () => {
        setFilters({
            regulation: '',
            semester: '',
            subject: '',
            type: '',
            search: '',
        });
    };

    const availableSubjects = useMemo(() => {
        if (!filters.regulation || !filters.semester) {
            return [];
        }
        return getSubjectsByRegulationAndSemester(filters.regulation, filters.semester);
    }, [filters.regulation, filters.semester]);

    const filteredResources = useMemo(() => {
        let result = [...resources];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(r =>
                r.title?.toLowerCase().includes(searchLower) ||
                r.subject?.toLowerCase().includes(searchLower) ||
                r.file_name?.toLowerCase().includes(searchLower)
            );
        }

        return result;
    }, [resources, filters.search]);

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleDownload = async (resource) => {
        if (!isAuthenticated) {
            alert('Please sign in to download resources');
            return;
        }

        if (!resource.file_url) {
            alert('File URL not available');
            return;
        }

        try {
            const checkResponse = await fetch(resource.file_url, { method: 'HEAD' });

            if (!checkResponse.ok) {
                const shouldRemove = confirm(
                    'This file has been deleted from storage and is no longer available. Would you like to remove this broken entry from the list?'
                );

                if (shouldRemove && (isAdmin() || (isApprovedFaculty() && resource.uploaded_by === user?.uid))) {
                    try {
                        await deleteResource(resource.id, resource.file_path);
                        setResources(prev => prev.filter(r => r.id !== resource.id));
                        alert('Broken entry removed successfully.');
                    } catch (delErr) {
                        console.error('Failed to remove broken entry:', delErr);
                    }
                }
                return;
            }

            incrementDownloads(resource.id).catch(err =>
                console.error('Failed to increment download count:', err)
            );

            const link = document.createElement('a');
            link.href = resource.file_url;
            link.download = resource.file_name || `${resource.title}.pdf`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const url = new URL(resource.file_url);
            url.searchParams.set('download', resource.file_name || `${resource.title}.pdf`);
            link.href = url.toString();

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to download. The file may no longer be available.');
        }
    };

    const handleDelete = async (resource) => {
        if (!confirm(`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(resource.id);
        try {
            await deleteResource(resource.id, resource.file_path);
            setResources(prev => prev.filter(r => r.id !== resource.id));
            alert('Resource deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete resource. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const canDelete = (resource) => {
        if (!user) return false;
        if (isAdmin()) return true;
        if (isApprovedFaculty() && resource.uploaded_by === user.uid) return true;
        return false;
    };

    const refreshResources = () => {
        setLoading(true);
        setError(null);
        setFilters(prev => ({ ...prev }));
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                        Academic Resources
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-neutral-600">
                            Browse notes and previous year question papers by regulation, semester, and subject
                        </p>
                        <button
                            onClick={refreshResources}
                            disabled={loading}
                            className="btn btn-outline text-sm"
                            title="Refresh resources"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="card sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="label">Regulation</label>
                                    <select
                                        value={filters.regulation}
                                        onChange={(e) => updateFilter('regulation', e.target.value)}
                                        className="select"
                                    >
                                        <option value="">All Regulations</option>
                                        {regulations.map(reg => (
                                            <option key={reg.id} value={reg.id}>
                                                {reg.name} - {reg.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Semester</label>
                                    <select
                                        value={filters.semester}
                                        onChange={(e) => updateFilter('semester', e.target.value)}
                                        className="select"
                                    >
                                        <option value="">All Semesters</option>
                                        {semesters.map(sem => (
                                            <option key={sem.id} value={sem.id}>
                                                Year {sem.year} - Sem {sem.sem} ({sem.name})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Subject</label>
                                    <select
                                        value={filters.subject}
                                        onChange={(e) => updateFilter('subject', e.target.value)}
                                        className="select"
                                        disabled={!filters.regulation || !filters.semester}
                                    >
                                        <option value="">
                                            {!filters.regulation || !filters.semester
                                                ? 'Select regulation & semester first'
                                                : 'All Subjects'}
                                        </option>
                                        {availableSubjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.code} - {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Resource Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateFilter('type', filters.type === 'notes' ? '' : 'notes')}
                                            className={`flex-1 btn ${filters.type === 'notes'
                                                ? 'btn-primary'
                                                : 'btn-outline'
                                                } text-sm py-2`}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Notes
                                        </button>
                                        <button
                                            onClick={() => updateFilter('type', filters.type === 'pyq' ? '' : 'pyq')}
                                            className={`flex-1 btn ${filters.type === 'pyq'
                                                ? 'btn-primary'
                                                : 'btn-outline'
                                                } text-sm py-2`}
                                        >
                                            <FileQuestion className="w-4 h-4" />
                                            PYQs
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <p className="text-sm text-neutral-600 mb-3">Active filters:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filters.regulation && (
                                            <span className="badge badge-primary flex items-center gap-1">
                                                {filters.regulation}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() => updateFilter('regulation', '')}
                                                />
                                            </span>
                                        )}
                                        {filters.semester && (
                                            <span className="badge badge-primary flex items-center gap-1">
                                                Sem {filters.semester}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() => updateFilter('semester', '')}
                                                />
                                            </span>
                                        )}
                                        {filters.type && (
                                            <span className="badge badge-secondary flex items-center gap-1">
                                                {filters.type === 'notes' ? 'Notes' : 'PYQs'}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() => updateFilter('type', '')}
                                                />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                    className="input input-left-icon"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden btn btn-outline"
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <p className="text-neutral-600">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {loadingMessage}
                                    </span>
                                ) : (
                                    <>Showing <span className="font-semibold text-neutral-900">{filteredResources.length}</span> resources</>
                                )}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="card-outline animate-pulse">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-neutral-200" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredResources.length > 0 ? (
                            <div className="grid gap-3">
                                {filteredResources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="card-outline group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${resource.type === 'notes'
                                                ? 'bg-primary-100 group-hover:bg-primary-200'
                                                : 'bg-secondary-100 group-hover:bg-secondary-200'
                                                } transition-colors`}>
                                                <FileText className={`w-5 h-5 ${resource.type === 'notes' ? 'text-primary-600' : 'text-secondary-600'}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <p className="text-xs text-neutral-600 mb-1">
                                                    {resource.subject || resource.file_name}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                    <span className="badge badge-primary">
                                                        {resource.regulation}
                                                    </span>
                                                    <span className="badge badge-secondary">
                                                        Sem {resource.semester}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {resource.uploader_name || 'Unknown'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(resource.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Download className="w-3 h-3" />
                                                        {resource.downloads || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:flex-shrink-0">
                                                <span className="text-sm text-neutral-500">
                                                    {formatFileSize(resource.file_size)}
                                                </span>
                                                <button
                                                    onClick={() => handleDownload(resource)}
                                                    className="btn btn-primary text-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                                {canDelete(resource) && (
                                                    <button
                                                        onClick={() => handleDelete(resource)}
                                                        disabled={deleting === resource.id}
                                                        className="btn btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                        title="Delete resource"
                                                    >
                                                        {deleting === resource.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-10 h-10 text-neutral-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                    No resources found
                                </h3>
                                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                                    {hasActiveFilters
                                        ? "Try adjusting your filters or search query to find what you're looking for."
                                        : "No resources have been uploaded yet. Check back later!"}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="btn btn-outline"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}

                        {!isAuthenticated && filteredResources.length > 0 && (
                            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-neutral-900 mb-1">
                                            Sign in to download
                                        </h3>
                                        <p className="text-sm text-neutral-600">
                                            You need to be logged in to download resources. It's free and takes only a minute!
                                        </p>
                                    </div>
                                    <a href="/login" className="btn btn-primary flex-shrink-0">
                                        Sign In
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
