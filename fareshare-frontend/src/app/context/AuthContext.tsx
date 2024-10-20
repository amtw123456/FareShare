// app/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Client-side cookie management

interface AuthContextType {
    token: string | null;
    userId: number | null;
    userEmail: string | null;
    tokenExpiry: number | null;

    setToken: (token: string | null) => void;
    setUserId: (userId: number | null) => void;
    setUserEmail: (email: string | null) => void;
    setTokenExpiry: (tokenExpiry: number | null) => void;
    logout: () => void; // Add logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter(); // Initialize router
    const [token, setToken] = useState<string | null>(Cookies.get('token') || null);
    const [userEmail, setUserEmail] = useState<string | null>(Cookies.get('userEmail') || null);
    const [userId, setUserId] = useState<number | null>(parseInt(Cookies.get('userId') || '0', 10) || null);
    const [tokenExpiry, setTokenExpiry] = useState<number | null>(parseInt(Cookies.get('tokenExpiry') || '0', 10) || null);

    const updateToken = (newToken: string | null) => {
        setToken(newToken);
        if (newToken) {
            Cookies.set('token', newToken, { expires: 7 }); // Set cookie to expire in 7 days
        } else {
            Cookies.remove('token');
        }
    };

    const updateUserEmail = (email: string | null) => {
        setUserEmail(email);
        if (email) {
            Cookies.set('userEmail', email, { expires: 7 });
        } else {
            Cookies.remove('userEmail');
        }
    };

    const updateUserId = (id: number | null) => {
        setUserId(id);
        if (id !== null) {
            Cookies.set('userId', id.toString(), { expires: 7 });
        } else {
            Cookies.remove('userId');
        }
    };

    const updateTokenExpiry = (expiry: number | null) => {
        setTokenExpiry(expiry);
        if (expiry !== null) {
            Cookies.set('tokenExpiry', expiry.toString(), { expires: 7 });
        } else {
            Cookies.remove('tokenExpiry');
        }
    };

    const logout = () => {
        updateToken(null);
        updateUserEmail(null);
        updateUserId(null);
        updateTokenExpiry(null);

        router.push('/login')
    };

    useEffect(() => {
        // Load values from cookies on mount
        const savedToken = Cookies.get('token');
        const savedUserEmail = Cookies.get('userEmail');
        const savedUserId = parseInt(Cookies.get('userId') || '0', 10);
        const savedTokenExpiry = parseInt(Cookies.get('tokenExpiry') || '0', 10);

        if (savedToken) setToken(savedToken);
        if (savedUserEmail) setUserEmail(savedUserEmail);
        if (!isNaN(savedUserId)) setUserId(savedUserId);
        if (!isNaN(savedTokenExpiry)) setTokenExpiry(savedTokenExpiry);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                userId,
                userEmail,
                tokenExpiry,
                setToken: updateToken,
                setUserId: updateUserId,
                setUserEmail: updateUserEmail,
                setTokenExpiry: updateTokenExpiry,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
