import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('currentUser')) || { username: '', id: '' });
    const [isInitialized, setIsInitialized] = useState(false);
    useEffect(() => {
            setIsInitialized(true);
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, isInitialized }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
