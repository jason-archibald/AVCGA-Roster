import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>AVCGA CrewHub</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/users">Members</Link>
                    <Link to="/assets">Assets</Link>
                    <Link to="/rosters">Rosters</Link>
                    <Link to="/organization">Organization</Link>
                    <Link to="/password">Password</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
