import { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../ApiService';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const apiService = new ApiService();

    const fetchUser = async () => {
        try {
            const data = await apiService.get('/users/me');
            setUser(data || null);
        } catch (error) {
            setUser(null);
        } finally {
            setIsInitialized(true);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    // יציאה מהמערכת
    const logout = async () => {
        try {
            const response = await apiService.post('/users/logout');
            if (response?.message === 'Logout successful') {
                setUser(null);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, isInitialized, fetchUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
