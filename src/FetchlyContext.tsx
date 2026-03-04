import React, { createContext, useContext, ReactNode } from 'react';
import { FetchlyOptions, FetchlyContextType } from './types';

const FetchlyContext = createContext<FetchlyContextType>({
    defaults: {},
});

export const useFetchlyContext = () => useContext(FetchlyContext);

interface FetchlyProviderProps {
    children: ReactNode;
    defaults?: FetchlyOptions;
}

export const FetchlyProvider: React.FC<FetchlyProviderProps> = ({ children, defaults }) => {
    return (
        <FetchlyContext.Provider value={{ defaults }}>
            {children}
        </FetchlyContext.Provider>
    );
};
