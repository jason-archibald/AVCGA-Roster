import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc', background: 'white' }}>
                <h1 style={{margin: 0 }}>Member Portal</h1>
                <nav>
                    {user ? (
                        <>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/calendar" style={{marginLeft: '1rem'}}>Calendar</NavLink>
                            <span style={{marginLeft: '2rem'}}>Welcome, {user.first_name}!</span>
                            <button onClick={handleLogout} style={{marginLeft: '1rem'}}>Logout</button>
                        </>
                    ) : <NavLink to="/login">Login</NavLink>}
                </nav>
            </header>
            <main style={{padding: '1rem'}}>{children}</main>
        </div>
    );
};
export default Layout;
