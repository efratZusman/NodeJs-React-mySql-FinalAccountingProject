// import React, { createContext, useState, useContext, useEffect } from 'react';

// const UserContext = createContext();

// export const useUserContext = () => {
//     return useContext(UserContext);
// };

// export const UserProvider = ({ children }) => {
//     const [userData, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || { username: '', id: '' });
//     const [isInitialized, setIsInitialized] = useState(false);
//     useEffect(() => {
//             setIsInitialized(true);
//     }, []);

//     return (
//         <UserContext.Provider value={{ userData, setUser, isInitialized }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export default UserContext;

import { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../ApiService';

const UserContext = createContext();
const apiService = new ApiService();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

     const fetchUser = async () => {
        try {
            const data = await apiService.get('/users/me');
            setUser(data || null);
        } catch (err) {
            setUser(null);
        } finally {
            setIsInitialized(true);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const data = await apiService.get('/users/me');
    //             console.log(`Fetching user data: ${data}`);
                
    //             if (data)
    //                 setUser(data);
    //             else {
    //                 setUser(null);
    //             }
    //         } catch (err) {
    //             console.error('Error fetching user:', err);
    //             setUser(null);
    //         } finally {
    //             setIsInitialized(true);
    //         }
    //     };
    //     fetchUser();
    // }, []);

    // const login = () => {
    //     // setUser(userData);
    // };

    const logout = async () => {
        try {
            const response = await apiService.post(`/users/logout`);
            if (response && response.message === 'Logout successful') {
                setUser(null);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <UserContext.Provider value={{ fetchUser, logout, user, isInitialized }}>
            {children}
        </UserContext.Provider>
    );
};

