// import { createContext, useEffect, useState, type ReactNode } from "react";
// import api from "./api";


// export interface UserData {
//     id?: string;
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     userImage?: string;
//     createdAt?: string;
// }
// export interface mainContextType {
//     loading: boolean;
//     setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//     setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
//     user: UserData | null;
//     logout: () => Promise<void>;
//    // setToken: React.Dispatch<React.SetStateAction<string | null>>;
//     token: string | null
// }

// export const MainContext = createContext<mainContextType | null>(null);
// export function MainProvider({ children }: { children: ReactNode }) {
//     const [user, setUser] = useState<UserData | null>(null);
//     const [loading, setLoading] = useState(true);
// const [token, setToken] = useState<string | null>(null);


//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 setLoading(true);
//                 const res = await api.get("/auth/me");
//                 if (res.data.status === "success") {
//                     // console.log("checkAuth:", res.data.data);
//                     setUser(res.data.data)
//                     setToken(res.data.token)
//                     console.log(token)
//                 }
              
//             } catch (err) { console.error("Auth check failed:", err); }
//             finally { setLoading(false); }
//         };
//         checkAuth();
//     }, []);


//     const logout = async () => {
//         try {
//             await api.post('/auth/logout');
//             setUser(null);
//             setToken(null);
//             window.location.href = "/login";
//         } catch (error) {
//             console.error("Logout failed", error);
//         }
//     };






//     return (
//         <MainContext.Provider value={{ user, setUser, loading, setLoading, logout,token }}>
//             {children}
//         </MainContext.Provider>)

// }

import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "./api";
import { toast } from "react-toastify";

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
    token: string | null;
    // إضافات السلة الجديدة
    cartCount: number;
    addToCart: (productId: string) => Promise<void>;
    getCartCount: () => Promise<void>;
}

export const MainContext = createContext<mainContextType | null>(null);

export function MainProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    
    // حالة السلة الجديدة
    const [cartCount, setCartCount] = useState<number>(0);

    // وظيفة جلب عدد عناصر السلة
    const getCartCount = async () => {
        try {
            const res = await api.get('/api/cart');
            if (res.data.cart) {
                const count = res.data.cart.cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
                setCartCount(count);
            }
        } catch (err) {
            setCartCount(0);
        }
    };

    // وظيفة إضافة منتج للسلة
    const addToCart = async (productId: string) => {
        try {
            const res = await api.post('/api/cart', { productId });
            if (res.data.message === "success") {
                toast.success("تمت الإضافة للعربة بنجاح");
                // تحديث العداد فوراً من البيانات الراجعة
                const count = res.data.cart.cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
                setCartCount(count);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                toast.error("يرجى تسجيل الدخول أولاً");
            } else {
                toast.error("فشل إضافة المنتج للسلة");
            }
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                if (res.data.status === "success") {
                    setUser(res.data.data);
                    setToken(res.data.token);
                    // جلب السلة فور التأكد من تسجيل الدخول
                    getCartCount();
                }
            } catch (err) { 
                console.error("Auth check failed:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setToken(null);
            setCartCount(0); // تصغير السلة عند تسجيل الخروج
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <MainContext.Provider value={{ 
            user, setUser, loading, setLoading, logout, token,
            cartCount, addToCart, getCartCount // تمرير قيم السلة
        }}>
            {children}
        </MainContext.Provider>
    );
}
