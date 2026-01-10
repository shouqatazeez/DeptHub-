import { supabase } from './config';

let keepAliveInterval = null;

export const startKeepAlive = () => {
    if (keepAliveInterval) {
        return;
    }

    pingSupabase();
    refreshAuthSession();

    keepAliveInterval = setInterval(() => {
        pingSupabase();
        refreshAuthSession();
    }, 4 * 60 * 1000);

    console.log(' Supabase keep-alive started');
};

export const stopKeepAlive = () => {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
        console.log(' Supabase keep-alive stopped');
    }
};

const pingSupabase = async () => {
    try {
        const startTime = Date.now();

        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const duration = Date.now() - startTime;

        if (error) {
            console.warn(' Keep-alive ping failed:', error.message);
        } else {
            console.log(` Keep-alive ping successful (${duration}ms)`);
        }
    } catch (err) {
        console.warn(' Keep-alive ping error:', err.message);
    }
};

const refreshAuthSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session) {
            const { data, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError) {
                console.warn(' Auth session refresh warning:', refreshError.message);
            } else if (data.session) {
                console.log(' Auth session refreshed');
            }
        }
    } catch (err) {
        if (!err.message?.includes('no session')) {
            console.warn(' Auth session check error:', err.message);
        }
    }
};

export const checkSupabaseHealth = async () => {
    try {
        const startTime = Date.now();

        const { error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const duration = Date.now() - startTime;

        if (error) {
            return { healthy: false, duration, error: error.message };
        }

        return {
            healthy: duration < 5000,
            duration,
            status: duration < 1000 ? 'fast' : duration < 5000 ? 'slow' : 'very slow'
        };
    } catch (err) {
        return { healthy: false, duration: 0, error: err.message };
    }
};

export const wakeUpSupabase = async () => {
    const maxRetries = 3;
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const { error } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            if (!error) {
                return { success: true, attempts: i + 1 };
            }
            lastError = error;
        } catch (err) {
            lastError = err;
        }

        if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return { success: false, error: lastError?.message || 'Unknown error', attempts: maxRetries };
};
