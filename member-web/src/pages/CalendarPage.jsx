import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarPage = () => {
    const [rosters, setRosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRosters = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/rosters', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRosters(response.data);
            } catch (err) {
                setError('Failed to load rosters');
                console.error('Error fetching rosters:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRosters();
    }, []);

    if (loading) return <div>Loading calendar...</div>;

    if (error) return (
        <div>
            <h2>Calendar & Rosters</h2>
            <p style={{ color: 'red' }}>{error}</p>
        </div>
    );

    return (
        <div>
            <h2>Calendar & Rosters</h2>
            
            {rosters.length === 0 ? (
                <p>No rosters scheduled at this time.</p>
            ) : (
                <div>
                    <h3>Upcoming Rosters</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Date</th>
                                <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Title</th>
                                <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Time</th>
                                <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rosters.map(roster => (
                                <tr key={roster.id}>
                                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        {new Date(roster.roster_date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        {roster.title}
                                    </td>
                                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        {roster.start_time} - {roster.end_time}
                                    </td>
                                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        {roster.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
