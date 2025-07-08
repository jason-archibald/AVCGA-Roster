import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const OrganizationPage = () => {
    const [squadrons, setSquadrons] = useState([]);
    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSquadronForm, setShowSquadronForm] = useState(false);
    const [showFlotillaForm, setShowFlotillaForm] = useState(false);
    const [editingSquadron, setEditingSquadron] = useState(null);
    const [editingFlotilla, setEditingFlotilla] = useState(null);

    const [squadronForm, setSquadronForm] = useState({
        name: '',
        description: ''
    });

    const [flotillaForm, setFlotillaForm] = useState({
        name: '',
        description: '',
        squadron_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [squadronData, flotillaData] = await Promise.all([
                adminService.getSquadrons(),
                adminService.getFlotillas()
            ]);
            setSquadrons(squadronData);
            setFlotillas(flotillaData);
        } catch (err) {
            setError('Failed to load organization data');
            console.error('Error fetching organization data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSquadronSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSquadron) {
                await adminService.updateSquadron(editingSquadron.id, squadronForm);
            } else {
                await adminService.createSquadron(squadronForm);
            }
            setSquadronForm({ name: '', description: '' });
            setShowSquadronForm(false);
            setEditingSquadron(null);
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFlotillaSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFlotilla) {
                await adminService.updateFlotilla(editingFlotilla.id, flotillaForm);
            } else {
                await adminService.createFlotilla(flotillaForm);
            }
            setFlotillaForm({ name: '', description: '', squadron_id: '' });
            setShowFlotillaForm(false);
            setEditingFlotilla(null);
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditSquadron = (squadron) => {
        setEditingSquadron(squadron);
        setSquadronForm({
            name: squadron.name,
            description: squadron.description || ''
        });
        setShowSquadronForm(true);
    };

    const handleEditFlotilla = (flotilla) => {
        setEditingFlotilla(flotilla);
        setFlotillaForm({
            name: flotilla.name,
            description: flotilla.description || '',
            squadron_id: flotilla.squadron_id || ''
        });
        setShowFlotillaForm(true);
    };

    const handleDeleteSquadron = async (id) => {
        if (window.confirm('Are you sure you want to delete this squadron?')) {
            try {
                await adminService.deleteSquadron(id);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleDeleteFlotilla = async (id) => {
        if (window.confirm('Are you sure you want to delete this flotilla?')) {
            try {
                await adminService.deleteFlotilla(id);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const resetForms = () => {
        setSquadronForm({ name: '', description: '' });
        setFlotillaForm({ name: '', description: '', squadron_id: '' });
        setShowSquadronForm(false);
        setShowFlotillaForm(false);
        setEditingSquadron(null);
        setEditingFlotilla(null);
        setError('');
    };

    if (loading) return <div>Loading organization data...</div>;

    return (
        <div>
            <h2>Organization Management</h2>
            
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Squadrons Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Squadrons</h3>
                        <button 
                            onClick={() => setShowSquadronForm(true)}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                background: '#3498db', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Squadron
                        </button>
                    </div>

                    {showSquadronForm && (
                        <form onSubmit={handleSquadronSubmit} style={{ 
                            background: '#f8f9fa', 
                            padding: '1rem', 
                            borderRadius: '4px', 
                            marginBottom: '1rem' 
                        }}>
                            <h4>{editingSquadron ? 'Edit Squadron' : 'Add New Squadron'}</h4>
                            <input
                                type="text"
                                placeholder="Squadron Name"
                                value={squadronForm.name}
                                onChange={(e) => setSquadronForm({...squadronForm, name: e.target.value})}
                                required
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <textarea
                                placeholder="Description"
                                value={squadronForm.description}
                                onChange={(e) => setSquadronForm({...squadronForm, description: e.target.value})}
                                rows="3"
                                style={{ marginBottom: '0.5rem', resize: 'vertical' }}
                            />
                            <div>
                                <button type="submit" style={{ marginRight: '0.5rem' }}>
                                    {editingSquadron ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForms}>Cancel</button>
                            </div>
                        </form>
                    )}

                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {squadrons.length === 0 ? (
                            <p style={{ padding: '1rem' }}>No squadrons found</p>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Description</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {squadrons.map(squadron => (
                                        <tr key={squadron.id}>
                                            <td style={{ padding: '1rem' }}>{squadron.name}</td>
                                            <td style={{ padding: '1rem' }}>{squadron.description || 'No description'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button 
                                                    onClick={() => handleEditSquadron(squadron)}
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
                                                    onClick={() => handleDeleteSquadron(squadron.id)}
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
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Flotillas Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Flotillas</h3>
                        <button 
                            onClick={() => setShowFlotillaForm(true)}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                background: '#27ae60', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Flotilla
                        </button>
                    </div>

                    {showFlotillaForm && (
                        <form onSubmit={handleFlotillaSubmit} style={{ 
                            background: '#f8f9fa', 
                            padding: '1rem', 
                            borderRadius: '4px', 
                            marginBottom: '1rem' 
                        }}>
                            <h4>{editingFlotilla ? 'Edit Flotilla' : 'Add New Flotilla'}</h4>
                            <input
                                type="text"
                                placeholder="Flotilla Name"
                                value={flotillaForm.name}
                                onChange={(e) => setFlotillaForm({...flotillaForm, name: e.target.value})}
                                required
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <select
                                value={flotillaForm.squadron_id}
                                onChange={(e) => setFlotillaForm({...flotillaForm, squadron_id: e.target.value})}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                <option value="">Select Squadron</option>
                                {squadrons.map(squadron => (
                                    <option key={squadron.id} value={squadron.id}>
                                        {squadron.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Description"
                                value={flotillaForm.description}
                                onChange={(e) => setFlotillaForm({...flotillaForm, description: e.target.value})}
                                rows="3"
                                style={{ marginBottom: '0.5rem', resize: 'vertical' }}
                            />
                            <div>
                                <button type="submit" style={{ marginRight: '0.5rem' }}>
                                    {editingFlotilla ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForms}>Cancel</button>
                            </div>
                        </form>
                    )}

                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {flotillas.length === 0 ? (
                            <p style={{ padding: '1rem' }}>No flotillas found</p>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Squadron</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flotillas.map(flotilla => (
                                        <tr key={flotilla.id}>
                                            <td style={{ padding: '1rem' }}>{flotilla.name}</td>
                                            <td style={{ padding: '1rem' }}>{flotilla.squadron_name || 'Unassigned'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button 
                                                    onClick={() => handleEditFlotilla(flotilla)}
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
                                                    onClick={() => handleDeleteFlotilla(flotilla.id)}
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
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationPage;
