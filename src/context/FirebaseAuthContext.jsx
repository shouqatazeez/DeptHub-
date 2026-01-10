import { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from '../firebase/config';
import { supabase } from '../supabase/config';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchUserProfile(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (firebaseUser) => {
        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', firebaseUser.email)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (profile) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    ...profile
                });
            } else {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    role: 'student',
                    status: 'approved'
                });
            }
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                role: 'student',
                status: 'approved'
            });
        }
    };

    const signup = async (userData) => {
        const { email, password, name, role = 'student', department, regulation, semester } = userData;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, { displayName: name });

            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            let userProfile;

            if (existingUser) {
                const { data: updated, error: updateError } = await supabase
                    .from('users')
                    .update({
                        firebase_uid: firebaseUser.uid,
                        name: name || existingUser.name,
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', email)
                    .select()
                    .single();

                if (updateError) {
                    console.error('Error updating user profile:', updateError);
                }
                userProfile = updated || existingUser;
            } else {
                const newProfile = {
                    email,
                    name,
                    role,
                    firebase_uid: firebaseUser.uid,
                    department: department || 'Computer Science',
                    regulation: regulation || 'R20',
                    semester: semester || '1-1',
                    status: role === 'student' ? 'approved' : 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const { data: inserted, error: insertError } = await supabase
                    .from('users')
                    .insert([newProfile])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating user profile in Supabase:', insertError);
                }
                userProfile = inserted || newProfile;
            }

            setUser({
                uid: firebaseUser.uid,
                ...userProfile
            });

            return userProfile;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('email', firebaseUser.email)
                .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
            }

            const fullUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: profile?.name || firebaseUser.displayName || 'User',
                role: profile?.role || 'student',
                status: profile?.status || 'approved',
                department: profile?.department || 'Computer Science',
                regulation: profile?.regulation || 'R20',
                semester: profile?.semester || '1-1',
                ...profile
            };

            setUser(fullUser);
            return fullUser;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const updateUser = async (updates) => {
        if (!user?.uid) return;

        const { error } = await supabase
            .from('users')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.uid);

        if (error) {
            console.error('Error updating user:', error);
            throw error;
        }

        setUser(prev => ({ ...prev, ...updates }));
    };

    const isStudent = () => user?.role === 'student';
    const isFaculty = () => user?.role === 'faculty';
    const isAdmin = () => user?.role === 'admin';
    const isApprovedFaculty = () => user?.role === 'faculty' && user?.status === 'approved';

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        updateUser,
        isStudent,
        isFaculty,
        isAdmin,
        isApprovedFaculty,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
