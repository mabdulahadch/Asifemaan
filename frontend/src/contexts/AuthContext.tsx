import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile } from "@/lib/api/auth";



interface User {
    id: number;
    name: string;
    email: string;
    country: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoggedIn: false,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // On mount, check localStorage for existing token
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            // Validate token by fetching profile
            getProfile(savedToken)
                .then((res) => {
                    if (res.success) {
                        setUser(res.data);
                    } else {
                        localStorage.removeItem("token");
                        setToken(null);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
