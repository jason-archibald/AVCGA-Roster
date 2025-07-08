import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSquadrons: 0,
        totalFlotillas: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [users, squadrons, flotillas] = await Promise.all([
                    adminService.getAllUsers().catch(() => []),
                    adminService.getSquadrons().catch(() => []),
                    adminService.getFlotillas().catch(() => [])
                ]);

                setStats({
                    totalUsers: users.length,
                    totalSquadrons: squadrons.length,
                    totalFlotillas: flotillas.length
                });
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h2>Admin Dashboard</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>{stats.totalUsers}</h3>
                    <p>Total Members</p>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>{stats.totalSquadrons}</h3>
                    <p>Squadrons</p>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#f39c12', marginBottom: '0.5rem' }}>{stats.totalFlotillas}</h3>
                    <p>Flotillas</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <a href="/admin/users/new" style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#3498db', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Add New Member
                    </a>
                    <a href="/admin/rosters" style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#27ae60', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Manage Rosters
                    </a>
                    <a href="/admin/assets" style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#f39c12', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Manage Assets
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
