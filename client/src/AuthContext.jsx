import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('farmlink_token');
        if (token) {
            getMe().then(res => { setUser(res.data); setLoading(false); })
                .catch(() => { localStorage.removeItem('farmlink_token'); setLoading(false); });
        } else { setLoading(false); }
    }, []);

    const loginUser = (data) => {
        localStorage.setItem('farmlink_token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('farmlink_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
