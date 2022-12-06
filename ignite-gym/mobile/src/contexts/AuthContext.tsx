import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTO';

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken';
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser';

export type AuthContextDataProps = {
    user: UserDTO;
    signOut: () => void;
    isLoadingUserStorageData: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode;
} 

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps );

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorage] = useState(true);

   async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; //anexando o token em todas as requisições
        setUser(userData);
   } 

   async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
        setIsLoadingUserStorage(true);

        await storageUserSave(userData);
        await storageAuthTokenSave(token);
    } catch (error) {
        throw error
    } finally {
        setIsLoadingUserStorage(false);

    }
   }

   async function signIn(email: string, password: string) {
       try {
        const { data } = await api.post('/sessions', { email, password});

        if(data.user && data.token) {
            await storageUserAndTokenSave(data.user, data.token)
            userAndTokenUpdate(data.user, data.token);
        }
       } catch (error) {
        throw error;
       } finally {
        setIsLoadingUserStorage(false);
       }


    }

   async function signOut() {
        try {
            setIsLoadingUserStorage(true);

            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();

        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorage(false);
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated)

        } catch (error) {
            throw error
            
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorage(true);

            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token);
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
        <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData, signOut, updateUserProfile }}>
             {children}
        </AuthContext.Provider> 
    )
}