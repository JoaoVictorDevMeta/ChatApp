import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext<{ currentUser: any, loading: boolean } | null>(null);

export const AuthContextProvider = ({ children }:any) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
            setLoading(false);
            //console.log(user)
        })

        return () => {
            unsub()
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}