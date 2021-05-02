import React from 'react';

export default function Logout(){
    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        localStorage.clear();
    }
    return <button onClick={handleLogout}>logout</button>
}