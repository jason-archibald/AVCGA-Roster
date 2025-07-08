import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '220px', background: '#333', color: 'white', padding: '1rem', flexShrink: 0 }}>
                <h2>Admin Menu</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/rosters">Rosters</NavLink>
                    <NavLink to="/users">Members</NavLink>
                    <NavLink to="/assets">Assets</NavLink>
                    <NavLink to="/organization">Organization</NavLink>
                </nav>
                <div style={{marginTop: 'auto'}}>
                    {user && <p style={{fontSize:'0.8em'}}>{user.email}</p>}
                    <button onClick={handleLogout} style={{width: '100%'}}>Logout</button>
                </div>
            </aside>
            <main style={{flexGrow: 1, padding: '2rem'}}>{children}</main>
        </div>
    );
};
export default Layout;
