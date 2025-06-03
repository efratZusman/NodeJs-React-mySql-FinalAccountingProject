import React from "react";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import homepage from '../img/homepage.png'

function NavigationButtons() {
    const navigate = useNavigate();
    const { userData, setUserData } = useUserContext();
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUserData({ username: '', id: '' });
        navigate('/login');
    };
    return (
        <div >
            <img src={homepage} alt="Page Not Found" className="Homepage" onClick={() => { navigate(`/user/${userData.id}/home`) }} />
            <button className="Logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default NavigationButtons;
