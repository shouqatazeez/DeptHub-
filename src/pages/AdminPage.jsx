import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    User,
    BookOpen,
    Trash2,
    Eye,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import {
    fetchAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    fetchResources,
    updateResource,
    deleteResource
} from '../supabase/resourceService';

const AdminPage = () => {
    const { user, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [resourcesLoading, setResourcesLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState(null);

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Failed to load users');
        } finally {
            setUsersLoading(false);
        }
    };

    const loadResources = async () => {
        try {
            setResourcesLoading(true);
            const data = await fetchResources({});
            setResources(data);
        } catch (err) {
            console.error('Error loading resources:', err);
            setError('Failed to load resources');
        } finally {
            setResourcesLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin()) {
            loadUsers();
            loadResources();
        }
    }, []);

    const handleApprove = async (userId) => {
        setActionLoading(prev => ({ ...prev, [userId]: 'approve' }));
        setError(null);

        try {
            await updateUserStatus(userId, 'approved');
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, status: 'approved' } : u
            ));
        } catch (err) {
            console.error('Error approving user:', err);

            if (err.message?.includes('rate') || err.code === '429') {
                setError('Rate limited by Supabase. Please wait 30-60 seconds and try again.');
            } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
                setError('Network error. Please check your connection and try again.');
            } else if (err.message?.includes('JWT') || err.message?.includes('token')) {
                setError('Session expired. Please refresh the page and log in again.');
            } else {
                setError(`Failed to approve user: ${err.message || 'Unknown error'}`);
            }
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleReject = async (userId) => {
        setActionLoading(prev => ({ ...prev, [userId]: 'reject' }));
        try {
            await updateUserStatus(userId, 'rejected');
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, status: 'rejected' } : u
            ));
        } catch (err) {
            console.error('Error rejecting user:', err);
            setError('Failed to reject user');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleMakeAdmin = async (userId) => {
        if (!confirm('Are you sure you want to make this user an admin?')) return;

        setActionLoading(prev => ({ ...prev, [userId]: 'admin' }));
        try {
            await updateUserRole(userId, 'admin');
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: 'admin' } : u
            ));
        } catch (err) {
            console.error('Error making admin:', err);
            setError('Failed to make admin');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        setActionLoading(prev => ({ ...prev, [userId]: 'delete' }));
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleApproveResource = async (resourceId) => {
        setActionLoading(prev => ({ ...prev, [`res_${resourceId}`]: 'approve' }));
        try {
            await updateResource(resourceId, { status: 'approved' });
            setResources(prev => prev.map(r =>
                r.id === resourceId ? { ...r, status: 'approved' } : r
            ));
        } catch (err) {
            console.error('Error approving resource:', err);
            setError('Failed to approve resource');
        } finally {
            setActionLoading(prev => ({ ...prev, [`res_${resourceId}`]: null }));
        }
    };

    const handleDeleteResource = async (resourceId, filePath) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        setActionLoading(prev => ({ ...prev, [`res_${resourceId}`]: 'delete' }));
        try {
            await deleteResource(resourceId, filePath);
            setResources(prev => prev.filter(r => r.id !== resourceId));
        } catch (err) {
            console.error('Error deleting resource:', err);
            setError('Failed to delete resource');
        } finally {
            setActionLoading(prev => ({ ...prev, [`res_${resourceId}`]: null }));
        }
    };

    const stats = {
        totalUsers: users.length,
        pendingFaculty: users.filter(u => u.role === 'faculty' && u.status === 'pending').length,
        approvedFaculty: users.filter(u => u.role === 'faculty' && u.status === 'approved').length,
        students: users.filter(u => u.role === 'student').length,
        totalResources: resources.length,
        pendingResources: resources.filter(r => r.status === 'pending').length
    };

    if (!isAuthenticated || !isAdmin()) {
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
                        Only administrators can access this page.
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
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-neutral-600">
                                Manage users and resources
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-700 font-medium">{error}</p>
                                {error.includes('Rate') && (
                                    <p className="text-sm text-red-600 mt-1">
                                        Supabase free tier limits API requests. Wait 30-60 seconds before trying again.
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => loadUsers()}
                                    className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-red-700"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="card text-center">
                        <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
                        <p className="text-xs text-neutral-600">Total Users</p>
                    </div>
                    <div className="card text-center">
                        <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.pendingFaculty}</p>
                        <p className="text-xs text-neutral-600">Pending Faculty</p>
                    </div>
                    <div className="card text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.approvedFaculty}</p>
                        <p className="text-xs text-neutral-600">Approved Faculty</p>
                    </div>
                    <div className="card text-center">
                        <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.students}</p>
                        <p className="text-xs text-neutral-600">Students</p>
                    </div>
                    <div className="card text-center">
                        <FileText className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.totalResources}</p>
                        <p className="text-xs text-neutral-600">Resources</p>
                    </div>
                    <div className="card text-center">
                        <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-neutral-900">{stats.pendingResources}</p>
                        <p className="text-xs text-neutral-600">Pending Resources</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users'
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                    >
                        <Users className="w-4 h-4 inline-block mr-2" />
                        Users ({stats.totalUsers})
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'resources'
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Resources ({stats.totalResources})
                    </button>
                    <button
                        onClick={() => {
                            if (activeTab === 'users') loadUsers();
                            else loadResources();
                        }}
                        className="ml-auto px-4 py-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {activeTab === 'users' && (
                    <div className="card">
                        <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                            User Management
                        </h2>

                        {usersLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 text-neutral-500">
                                No users found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-200">
                                            <th className="text-left py-3 px-4 font-medium text-neutral-600">User</th>
                                            <th className="text-left py-3 px-4 font-medium text-neutral-600">Role</th>
                                            <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-neutral-600">Joined</th>
                                            <th className="text-right py-3 px-4 font-medium text-neutral-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-neutral-900">{u.name}</p>
                                                        <p className="text-sm text-neutral-500">{u.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        u.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge ${u.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        u.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-neutral-500">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {u.status === 'pending' && u.role === 'faculty' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(u.id)}
                                                                    disabled={actionLoading[u.id]}
                                                                    className="btn btn-primary text-xs py-1 px-2"
                                                                >
                                                                    {actionLoading[u.id] === 'approve' ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="w-3 h-3" />
                                                                    )}
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(u.id)}
                                                                    disabled={actionLoading[u.id]}
                                                                    className="btn bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2"
                                                                >
                                                                    {actionLoading[u.id] === 'reject' ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <XCircle className="w-3 h-3" />
                                                                    )}
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {u.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleMakeAdmin(u.id)}
                                                                disabled={actionLoading[u.id]}
                                                                className="btn btn-outline text-xs py-1 px-2"
                                                                title="Make Admin"
                                                            >
                                                                <Shield className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={actionLoading[u.id]}
                                                            className="btn bg-neutral-100 hover:bg-red-100 text-neutral-600 hover:text-red-600 text-xs py-1 px-2"
                                                            title="Delete User"
                                                        >
                                                            {actionLoading[u.id] === 'delete' ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="card">
                        <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                            Resource Management
                        </h2>

                        {resourcesLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="text-center py-12 text-neutral-500">
                                No resources found
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {resources.map(resource => (
                                    <div key={resource.id} className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resource.type === 'notes' ? 'bg-primary-100' : 'bg-secondary-100'
                                                }`}>
                                                <FileText className={`w-5 h-5 ${resource.type === 'notes' ? 'text-primary-600' : 'text-secondary-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-neutral-900">{resource.title}</h3>
                                                <p className="text-sm text-neutral-500">
                                                    {resource.subject} • {resource.regulation} • Sem {resource.semester}
                                                </p>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Uploaded by {resource.uploader_name} on {new Date(resource.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`badge ${resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    resource.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {resource.status}
                                                </span>
                                                {resource.file_url && (
                                                    <a
                                                        href={resource.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline text-xs py-1 px-2"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {resource.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApproveResource(resource.id)}
                                                        disabled={actionLoading[`res_${resource.id}`]}
                                                        className="btn btn-primary text-xs py-1 px-2"
                                                    >
                                                        {actionLoading[`res_${resource.id}`] === 'approve' ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-3 h-3" />
                                                        )}
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteResource(resource.id, resource.file_path)}
                                                    disabled={actionLoading[`res_${resource.id}`]}
                                                    className="btn bg-neutral-100 hover:bg-red-100 text-neutral-600 hover:text-red-600 text-xs py-1 px-2"
                                                >
                                                    {actionLoading[`res_${resource.id}`] === 'delete' ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
