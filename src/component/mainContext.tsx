import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "./api";


export interface UserData {
    id?: string;
    _id: string;
    name: string;
    email: string;
    role: string;
    userImage?: string;
    createdAt?: string;
}
export interface mainContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    user: UserData | null;
    logout: () => Promise<void>;
   // setToken: React.Dispatch<React.SetStateAction<string | null>>;
    token: string | null
}

export const MainContext = createContext<mainContextType | null>(null);
export function MainProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                if (res.data.status === "success") {
                    // console.log("checkAuth:", res.data.data);
                    setUser(res.data.data)
                    setToken(res.data.token)
                    console.log(token)
                }
              
            } catch (err) { console.error("Auth check failed:", err); }
            finally { setLoading(false); }
        };
        checkAuth();
    }, []);


    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setToken(null);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };






    return (
        <MainContext.Provider value={{ user, setUser, loading, setLoading, logout,token }}>
            {children}
        </MainContext.Provider>)

}
