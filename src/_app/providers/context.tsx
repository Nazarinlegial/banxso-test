'use client'
import React, {createContext, Dispatch, SetStateAction, useContext, useState} from 'react';
import {IUser} from "@/entity/user/types";


export type IAppContext = {
    user: IUser,
    isAuth?: boolean
    updateState: (newState: Partial<Omit<IAppContext, 'updateState'>>) => void
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext)

export function AppProvider({children}: { children: React.ReactNode}) {
    const [context, setContext] = useState<IAppContext>({isAuth: false} as IAppContext)

    const updateState = (newState: Partial<IAppContext>) => {
        setContext(prevState =>  ({
            ...prevState,
            ...newState
        }))
    }

    return (
        <AppContext.Provider value={{ ...context, updateState}}>
            {children}
        </AppContext.Provider>
    );
}