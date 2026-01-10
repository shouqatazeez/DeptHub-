import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCJTS0m5-hJDNVNR6TTPmWZLUsKLzCPtRE",
    authDomain: "depthub-541ef.firebaseapp.com",
    projectId: "depthub-541ef",
    storageBucket: "depthub-541ef.firebasestorage.app",
    messagingSenderId: "24251788380",
    appId: "1:24251788380:web:aee6edd562aac172684a99"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
};

export default app;
