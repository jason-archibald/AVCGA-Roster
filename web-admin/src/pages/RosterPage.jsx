import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

const RosterPage = () => {
    const navigate = useNavigate();
    const [rosters, setRosters] = useState([]);
    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRoster, setEditingRoster] = useState(null);

    const [rosterForm, setRosterForm] = useState({
        title: '',
        description: '',
        roster_date: '',
        start_time: '',
        end_time: '',
        status: 'Draft',
        flotilla_id: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rosterData, flotillaData] = await Promise.all([
                adminService.getRosters(),
                adminService.getFlotillas()
            ]);
            setRosters(rosterData);
            setFlotillas(flotillaData);
        } catch (err) {
            setError('Failed to load roster data');
            console.error('Error fetching roster data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoster) {
                await adminService.updateRoster(editingRoster.id, rosterForm);
            } else {
                await adminService.createRoster(rosterForm);
            }
            resetForm();
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (roster) => {
        setEditingRoster(roster);
        setRosterForm({
            title: roster.title,
            description: roster.description || '',
            roster_date: roster.roster_date,
            start_time: roster.start_time,
            end_time: roster.end_time,
            status: roster.status,
            flotilla_id: roster.flotilla_id || '',
            notes: roster.notes || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this roster? All assignments will also be deleted.')) {
            try {
                await adminService.deleteRoster(id);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const resetForm = () => {
        setRosterForm({
            title: '',
            description: '',
            roster_date: '',
            start_time: '',
            end_time: '',
            status: 'Draft',
            flotilla_id: '',
            notes: ''
        });
        setShowForm(false);
        setEditingRoster(null);
        setError('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return { bg: '#d4edda', color: '#155724' };
            case 'Published': return { bg: '#d1ecf1', color: '#0c5460' };
            case 'Completed': return { bg: '#d3d3d4', color: '#383d41' };
            case 'Cancelled': return { bg: '#f8d7da', color: '#721c24' };
            default: return { bg: '#fff3cd', color: '#856404' };
        }
    };

    if (loading) return <div>Loading rosters...</div>;

    const rosterStatuses = ['Draft', 'Published', 'Active', 'Completed', 'Cancelled'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Roster Management</h2>
                <button 
                    onClick={() => setShowForm(true)}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Create New Roster
                </button>
            </div>

            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '1rem', 
                    padding: '0.5rem', 
                    background: '#fee', 
                    borderRadius: '4px' 
                }}>
                    {error}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} style={{ 
                    background: '#f8f9fa', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    marginBottom: '2rem',
                    maxWidth: '600px'
                }}>
                    <h3>{editingRoster ? 'Edit Roster' : 'Create New Roster'}</h3>
                    
                    <input
                        type="text"
                        placeholder="Roster Title"
                        value={rosterForm.title}
                        onChange={(e) => setRosterForm({...rosterForm, title: e.target.value})}
                        required
                        style={{ marginBottom: '1rem' }}
                    />

                    <textarea
                        placeholder="Description"
                        value={rosterForm.description}
                        onChange={(e) => setRosterForm({...rosterForm, description: e.target.value})}
                        rows="3"
                        style={{ marginBottom: '1rem', resize: 'vertical' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <input
                            type="date"
                            value={rosterForm.roster_date}
                            onChange={(e) => setRosterForm({...rosterForm, roster_date: e.target.value})}
                            required
                        />
                        <input
                            type="time"
                            value={rosterForm.start_time}
                            onChange={(e) => setRosterForm({...rosterForm, start_time: e.target.value})}
                            required
                        />
                        <input
                            type="time"
                            value={rosterForm.end_time}
                            onChange={(e) => setRosterForm({...rosterForm, end_time: e.target.value})}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <select
                            value={rosterForm.status}
                            onChange={(e) => setRosterForm({...rosterForm, status: e.target.value})}
                        >
                            {rosterStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <select
                            value={rosterForm.flotilla_id}
                            onChange={(e) => setRosterForm({...rosterForm, flotilla_id: e.target.value})}
                        >
                            <option value="">Select Flotilla (Optional)</option>
                            {flotillas.map(flotilla => (
                                <option key={flotilla.id} value={flotilla.id}>
                                    {flotilla.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        placeholder="Notes"
                        value={rosterForm.notes}
                        onChange={(e) => setRosterForm({...rosterForm, notes: e.target.value})}
                        rows="3"
                        style={{ marginBottom: '1rem', resize: 'vertical' }}
                    />

                    <div>
                        <button type="submit" style={{ marginRight: '0.5rem' }}>
                            {editingRoster ? 'Update Roster' : 'Create Roster'}
                        </button>
                        <button type="button" onClick={resetForm}>Cancel</button>
                    </div>
                </form>
            )}

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {rosters.length === 0 ? (
                    <p style={{ padding: '2rem', textAlign: 'center' }}>No rosters found</p>
                ) : (
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Assignments</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Flotilla</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rosters.map(roster => {
                                const statusStyle = getStatusColor(roster.status);
                                return (
                                    <tr key={roster.id}>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => navigate(`/rosters/${roster.id}`)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#3498db',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    fontSize: 'inherit',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {roster.title}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {new Date(roster.roster_date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {roster.start_time} - {roster.end_time}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '12px', 
                                                fontSize: '0.875rem',
                                                background: statusStyle.bg,
                                                color: statusStyle.color
                                            }}>
                                                {roster.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                background: roster.assignment_count > 0 ? '#d4edda' : '#f8d7da',
                                                color: roster.assignment_count > 0 ? '#155724' : '#721c24',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {roster.assignment_count || 0} assigned
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{roster.flotilla_name || 'Unassigned'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button 
                                                onClick={() => navigate(`/rosters/${roster.id}`)}
                                                style={{ 
                                                    marginRight: '0.5rem', 
                                                    padding: '0.25rem 0.5rem',
                                                    background: '#27ae60',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Manage
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(roster)}
                                                style={{ 
                                                    marginRight: '0.5rem', 
                                                    padding: '0.25rem 0.5rem',
                                                    background: '#f39c12',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(roster.id)}
                                                style={{ 
                                                    padding: '0.25rem 0.5rem',
                                                    background: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RosterPage;
