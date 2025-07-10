import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    // These would be fetched from an API in a real implementation
    const stats = {
        members: 150,
        vessels: 12,
        rosters: 5,
        missions: 23,
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <h2>{stats.members}</h2>
                    <p>Active Members</p>
                </div>
                <div className="stat-card">
                    <h2>{stats.vessels}</h2>
                    <p>Operational Vessels</p>
                </div>
                <div className="stat-card">
                    <h2>{stats.rosters}</h2>
                    <p>Active Rosters</p>
                </div>
                <div className="stat-card">
                    <h2>{stats.missions}</h2>
                    <p>Missions This Month</p>
                </div>
            </div>
            <div className="quick-links">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/admin/users">Manage Members</a></li>
                    <li><a href="/admin/assets">Manage Assets</a></li>
                    <li><a href="/admin/rosters">Manage Rosters</a></li>
                    <li><a href="/admin/organization">Manage Organization</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
