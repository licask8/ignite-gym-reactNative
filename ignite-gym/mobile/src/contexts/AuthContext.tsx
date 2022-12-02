import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTO';
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser';

export type AuthContextDataProps = {
    user: UserDTO;
    signOut: () => void;
    isLoadingUserStorageData: boolean;
    signIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
} 

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps );

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorage] = useState(true)

   async function signIn(email: string, password: string) {
       try {
        const { data } = await api.post('/sessions', { email, password});

        if(data.user) {
            setUser(data.user);
            storageUserSave(data.user);
        }
       } catch (error) {
        throw error;
       }


    }

   async function signOut() {
        try {
            setIsLoadingUserStorage(true)
            setUser({} as UserDTO);
            await storageUserRemove();

        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorage(false);

        }
    }

    async function loadUserData() {
        try {
            isLoadingUserStorageData
            const userLogged = await storageUserGet();

            if (userLogged) {
                setUser(userLogged);
                
            }
        } catch (error) {
            throw error;
            
        } finally {
            setIsLoadingUserStorage(false);
        }
    }

    

    useEffect(() => {
        loadUserData();
    }, [])

    return (
        <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData, signOut }}>
             {children}
        </AuthContext.Provider> 
    )
}