import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Welcome to AVCGA CrewHub</h2>
            <p>Hello, {user?.first_name}! Welcome to your member dashboard.</p>
            
            <div style={{ marginTop: '2rem' }}>
                <h3>Quick Actions</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                        <a href="/calendar" style={{ 
                            display: 'inline-block', 
                            padding: '0.5rem 1rem', 
                            background: '#3498db', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '4px' 
                        }}>
                            View Calendar & Rosters
                        </a>
                    </li>
                </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>Recent Updates</h3>
                <p>No recent updates at this time.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
