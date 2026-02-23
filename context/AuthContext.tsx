'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
    id: number;
    username: string;
    email: string;
    profile_picture?: string;
    bio?: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const lastActivityRef = useRef(Date.now());

    useEffect(() => {
        checkUser();
    }, []);

    // Session Timeout Logic (5 Minutes)
    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        const interval = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityRef.current;
            // 30 minutes = 30 * 60 * 1000 ms = 1800000 ms
            if (timeSinceLastActivity > 1800000) {
                logout();
                toast.error('Session timed out due to inactivity');
            }
        }, 10000); // Check every 10 seconds

        return () => {
            events.forEach(event => window.removeEventListener(event, updateActivity));
            clearInterval(interval);
        };
    }, [user]);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/user');
                setUser(response.data);
                lastActivityRef.current = Date.now();
            } catch (err) {
                // Silently fail and logout if session check fails
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    const login = async (credentials: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            lastActivityRef.current = Date.now();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/register', data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            lastActivityRef.current = Date.now();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Logout error', err);
        }
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
