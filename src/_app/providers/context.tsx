'use client'
import React, {createContext, useContext, useState} from 'react';
import {UserCollection} from "@/db/schema/user";
import {IAccessPayload} from "@/backend/Services/jwt.service";


export type IAppContext = {
    user: IAccessPayload
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const useAppContext = () => useContext(AppContext)

export function AppProvider({children, state}: { children: React.ReactNode, state:IAppContext }) {

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}