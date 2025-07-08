import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const RosterPage = () => {
    const [rosters, setRosters] = useState([]);
    const [newShift, setNewShift] = useState({ roster_date: '', shift_name: '' });
    const [error, setError] = useState('');

    const fetchRosters = () => {
        adminService.getRosters().then(setRosters).catch(err => setError(err.message));
    };

    useEffect(() => {
        fetchRosters();
    }, []);
    
    const handleChange = (e) => setNewShift({...newShift, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminService.createRoster(newShift);
            alert('Shift created successfully!');
            setNewShift({ roster_date: '', shift_name: '' });
            fetchRosters(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Roster Management</h2>
            <div className="card">
                <h3>Create New Shift</h3>
                <form onSubmit={handleSubmit} style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <input type="date" name="roster_date" value={newShift.roster_date} onChange={handleChange} required />
                    <input type="text" name="shift_name" value={newShift.shift_name} onChange={handleChange} placeholder="Shift Name (e.g., Day Shift)" required />
                    <button type="submit">Create Shift</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>

            <div className="card">
                <h3>Existing Rosters</h3>
                <table>
                    <thead><tr><th>Date</th><th>Shift Name</th><th>Flotilla</th></tr></thead>
                    <tbody>
                        {rosters.map(r => (
                            <tr key={r.id}>
                                <td>{new Date(r.roster_date).toLocaleDateString()}</td>
                                <td>{r.shift_name}</td>
                                <td>{r.flotilla_name || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default RosterPage;
