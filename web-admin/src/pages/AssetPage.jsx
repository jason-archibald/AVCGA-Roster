import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const AssetPage = () => {
    const [vessels, setVessels] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showVesselForm, setShowVesselForm] = useState(false);
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [editingVessel, setEditingVessel] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const [vesselForm, setVesselForm] = useState({
        name: '',
        call_sign: '',
        status: 'Operational',
        notes: ''
    });

    const [vehicleForm, setVehicleForm] = useState({
        name: '',
        registration: '',
        status: 'Operational',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vesselData, vehicleData] = await Promise.all([
                adminService.getAllVessels(),
                adminService.getAllVehicles()
            ]);
            setVessels(vesselData);
            setVehicles(vehicleData);
        } catch (err) {
            setError('Failed to load asset data');
            console.error('Error fetching asset data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVesselSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVessel) {
                await adminService.updateVessel(editingVessel.id, vesselForm);
            } else {
                await adminService.createVessel(vesselForm);
            }
            resetVesselForm();
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVehicle) {
                await adminService.updateVehicle(editingVehicle.id, vehicleForm);
            } else {
                await adminService.createVehicle(vehicleForm);
            }
            resetVehicleForm();
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditVessel = (vessel) => {
        setEditingVessel(vessel);
        setVesselForm({
            name: vessel.name,
            call_sign: vessel.call_sign || '',
            status: vessel.status,
            notes: vessel.notes || ''
        });
        setShowVesselForm(true);
    };

    const handleEditVehicle = (vehicle) => {
        setEditingVehicle(vehicle);
        setVehicleForm({
            name: vehicle.name,
            registration: vehicle.registration || '',
            status: vehicle.status,
            notes: vehicle.notes || ''
        });
        setShowVehicleForm(true);
    };

    const handleDeleteVessel = async (id) => {
        if (window.confirm('Are you sure you want to delete this vessel?')) {
            try {
                await adminService.deleteVessel(id);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await adminService.deleteVehicle(id);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const resetVesselForm = () => {
        setVesselForm({ name: '', call_sign: '', status: 'Operational', notes: '' });
        setShowVesselForm(false);
        setEditingVessel(null);
    };

    const resetVehicleForm = () => {
        setVehicleForm({ name: '', registration: '', status: 'Operational', notes: '' });
        setShowVehicleForm(false);
        setEditingVehicle(null);
    };

    const resetError = () => setError('');

    if (loading) return <div>Loading asset data...</div>;

    const assetStatuses = ['Operational', 'Maintenance', 'Decommissioned'];

    return (
        <div>
            <h2>Asset Management</h2>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '1rem', 
                    padding: '0.5rem', 
                    background: '#fee', 
                    borderRadius: '4px',
                    position: 'relative'
                }}>
                    {error}
                    <button 
                        onClick={resetError}
                        style={{ 
                            position: 'absolute', 
                            right: '0.5rem', 
                            top: '0.5rem',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Vessels Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Vessels</h3>
                        <button 
                            onClick={() => setShowVesselForm(true)}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                background: '#3498db', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Vessel
                        </button>
                    </div>

                    {showVesselForm && (
                        <form onSubmit={handleVesselSubmit} style={{ 
                            background: '#f8f9fa', 
                            padding: '1rem', 
                            borderRadius: '4px', 
                            marginBottom: '1rem' 
                        }}>
                            <h4>{editingVessel ? 'Edit Vessel' : 'Add New Vessel'}</h4>
                            <input
                                type="text"
                                placeholder="Vessel Name"
                                value={vesselForm.name}
                                onChange={(e) => setVesselForm({...vesselForm, name: e.target.value})}
                                required
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <input
                                type="text"
                                placeholder="Call Sign"
                                value={vesselForm.call_sign}
                                onChange={(e) => setVesselForm({...vesselForm, call_sign: e.target.value})}
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <select
                                value={vesselForm.status}
                                onChange={(e) => setVesselForm({...vesselForm, status: e.target.value})}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                {assetStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Notes"
                                value={vesselForm.notes}
                                onChange={(e) => setVesselForm({...vesselForm, notes: e.target.value})}
                                rows="3"
                                style={{ marginBottom: '0.5rem', resize: 'vertical' }}
                            />
                            <div>
                                <button type="submit" style={{ marginRight: '0.5rem' }}>
                                    {editingVessel ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetVesselForm}>Cancel</button>
                            </div>
                        </form>
                    )}

                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {vessels.length === 0 ? (
                            <p style={{ padding: '1rem' }}>No vessels found</p>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Call Sign</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vessels.map(vessel => (
                                        <tr key={vessel.id}>
                                            <td style={{ padding: '0.75rem' }}>{vessel.name}</td>
                                            <td style={{ padding: '0.75rem' }}>{vessel.call_sign || 'N/A'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ 
                                                    padding: '0.25rem 0.5rem', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.875rem',
                                                    background: vessel.status === 'Operational' ? '#d4edda' : 
                                                               vessel.status === 'Maintenance' ? '#fff3cd' : '#f8d7da',
                                                    color: vessel.status === 'Operational' ? '#155724' : 
                                                           vessel.status === 'Maintenance' ? '#856404' : '#721c24'
                                                }}>
                                                    {vessel.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <button 
                                                    onClick={() => handleEditVessel(vessel)}
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
                                                    onClick={() => handleDeleteVessel(vessel.id)}
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

                {/* Vehicles Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Vehicles</h3>
                        <button 
                            onClick={() => setShowVehicleForm(true)}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                background: '#27ae60', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Vehicle
                        </button>
                    </div>

                    {showVehicleForm && (
                        <form onSubmit={handleVehicleSubmit} style={{ 
                            background: '#f8f9fa', 
                            padding: '1rem', 
                            borderRadius: '4px', 
                            marginBottom: '1rem' 
                        }}>
                            <h4>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
                            <input
                                type="text"
                                placeholder="Vehicle Name"
                                value={vehicleForm.name}
                                onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                                required
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <input
                                type="text"
                                placeholder="Registration"
                                value={vehicleForm.registration}
                                onChange={(e) => setVehicleForm({...vehicleForm, registration: e.target.value})}
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <select
                                value={vehicleForm.status}
                                onChange={(e) => setVehicleForm({...vehicleForm, status: e.target.value})}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                {assetStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Notes"
                                value={vehicleForm.notes}
                                onChange={(e) => setVehicleForm({...vehicleForm, notes: e.target.value})}
                                rows="3"
                                style={{ marginBottom: '0.5rem', resize: 'vertical' }}
                            />
                            <div>
                                <button type="submit" style={{ marginRight: '0.5rem' }}>
                                    {editingVehicle ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetVehicleForm}>Cancel</button>
                            </div>
                        </form>
                    )}

                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {vehicles.length === 0 ? (
                            <p style={{ padding: '1rem' }}>No vehicles found</p>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Registration</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map(vehicle => (
                                        <tr key={vehicle.id}>
                                            <td style={{ padding: '0.75rem' }}>{vehicle.name}</td>
                                            <td style={{ padding: '0.75rem' }}>{vehicle.registration || 'N/A'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ 
                                                    padding: '0.25rem 0.5rem', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.875rem',
                                                    background: vehicle.status === 'Operational' ? '#d4edda' : 
                                                               vehicle.status === 'Maintenance' ? '#fff3cd' : '#f8d7da',
                                                    color: vehicle.status === 'Operational' ? '#155724' : 
                                                           vehicle.status === 'Maintenance' ? '#856404' : '#721c24'
                                                }}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <button 
                                                    onClick={() => handleEditVehicle(vehicle)}
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
                                                    onClick={() => handleDeleteVehicle(vehicle.id)}
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

export default AssetPage;
