import React from 'react';

function UserInfo({ userDetails, onClose }) {
    const fieldsToShow = [ "Username", "Email", "CreatedAt",];
    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h2>User Information</h2>
            {fieldsToShow.map(field => 
                userDetails[field] && (
                    <p key={field}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {userDetails[field]}
                    </p>
                )
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default UserInfo;
