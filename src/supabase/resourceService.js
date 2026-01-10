import { supabase } from './config';

export const fetchResources = async (filters = {}) => {
    let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters.regulation && filters.regulation !== 'all') {
        query = query.eq('regulation', filters.regulation);
    }
    if (filters.semester && filters.semester !== 'all') {
        query = query.eq('semester', filters.semester);
    }
    if (filters.subject && filters.subject !== 'all') {
        query = query.eq('subject', filters.subject);
    }
    if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }

    return data || [];
};

export const fetchResourceById = async (id) => {
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching resource:', error);
        throw error;
    }

    return data;
};

export const uploadFile = async (file, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('resources')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

    return {
        path: filePath,
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size
    };
};

export const createResource = async (resourceData, user) => {
    const { data, error } = await supabase
        .from('resources')
        .insert([{
            ...resourceData,
            uploaded_by: user.uid,
            uploader_name: user.name,
            status: 'approved'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating resource:', error);
        throw error;
    }

    return data;
};

export const updateResource = async (id, updates) => {
    const { data, error } = await supabase
        .from('resources')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating resource:', error);
        throw error;
    }

    return data;
};

export const deleteResource = async (id, filePath) => {
    if (filePath) {
        const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([filePath]);

        if (storageError) {
            console.error('Error deleting file:', storageError);
        }
    }

    const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting resource:', error);
        throw error;
    }

    return true;
};

export const incrementDownloads = async (id) => {
    const { data, error } = await supabase.rpc('increment_downloads', { resource_id: id });

    if (error) {
        const resource = await fetchResourceById(id);
        await supabase
            .from('resources')
            .update({ downloads: (resource.downloads || 0) + 1 })
            .eq('id', id);
    }

    return data;
};

export const fetchAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }

    return data || [];
};

export const updateUserStatus = async (userId, status, retryCount = 0) => {
    const maxRetries = 3;

    try {
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, status')
            .eq('id', userId)
            .maybeSingle();

        if (fetchError) {
            console.error('Error fetching user for status update:', fetchError);
            throw new Error(`Cannot find user: ${fetchError.message}`);
        }

        if (!existingUser) {
            throw new Error('User not found or you do not have permission to modify this user');
        }

        const { data, error } = await supabase
            .from('users')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .maybeSingle();

        if (error) {
            const isRetryable = error.message?.includes('rate') ||
                error.message?.includes('timeout') ||
                error.message?.includes('fetch') ||
                error.code === 'PGRST301' ||
                error.code === '429';

            if (isRetryable && retryCount < maxRetries) {
                console.log(`Retrying updateUserStatus (attempt ${retryCount + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return updateUserStatus(userId, status, retryCount + 1);
            }

            if (error.code === 'PGRST116' || error.message?.includes('permission') || error.message?.includes('policy')) {
                throw new Error('Permission denied. Ensure you have admin privileges and RLS policies allow this update.');
            }

            console.error('Error updating user status:', error);
            throw error;
        }

        if (!data) {
            const { data: verifyUser } = await supabase
                .from('users')
                .select('status')
                .eq('id', userId)
                .maybeSingle();

            if (verifyUser?.status === status) {
                return { id: userId, status };
            }

            throw new Error('Update may be blocked by Row Level Security. Please check Supabase RLS policies on the users table.');
        }

        return data;
    } catch (err) {
        if (retryCount < maxRetries && (err.name === 'TypeError' || err.message?.includes('fetch'))) {
            console.log(`Retrying updateUserStatus after network error (attempt ${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return updateUserStatus(userId, status, retryCount + 1);
        }
        throw err;
    }
};

export const updateUserRole = async (userId, role) => {
    const { data, error } = await supabase
        .from('users')
        .update({
            role,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user role:', error);
        throw error;
    }

    return data;
};

export const deleteUser = async (userId) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting user:', error);
        throw error;
    }

    return true;
};

export default {
    fetchResources,
    fetchResourceById,
    uploadFile,
    createResource,
    updateResource,
    deleteResource,
    incrementDownloads,
    fetchAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser
};
