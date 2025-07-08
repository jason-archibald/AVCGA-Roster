import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem', 
                borderBottom: '1px solid #ccc', 
                background: '#2c3e50',
                color: 'white'
            }}>
                <h1 style={{ margin: 0 }}>AVCGA Admin Portal</h1>
                <nav>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" style={{ color: 'white', marginLeft: '1rem' }}>Dashboard</NavLink>
                            <NavLink to="/users" style={{ color: 'white', marginLeft: '1rem' }}>Members</NavLink>
                            <NavLink to="/organization" style={{ color: 'white', marginLeft: '1rem' }}>Organization</NavLink>
                            <NavLink to="/assets" style={{ color: 'white', marginLeft: '1rem' }}>Assets</NavLink>
                            <NavLink to="/rosters" style={{ color: 'white', marginLeft: '1rem' }}>Rosters</NavLink>
                            <span style={{ marginLeft: '2rem' }}>Welcome, {user.first_name}!</span>
                            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
                        </>
                    ) : (
                        <NavLink to="/login" style={{ color: 'white' }}>Login</NavLink>
                    )}
                </nav>
            </header>
            <main style={{ padding: '1rem' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
