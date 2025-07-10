import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Modal from './Modal';
import './AssetManagement.css';

const AssetManagement = () => {
    const [activeTab, setActiveTab] = useState('vessels');
    const [data, setData] = useState({ vessels: [], vehicles: [], equipment: [], facilities: [] });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { loadData(); }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            let result;
            switch (activeTab) {
                case 'vessels': result = await adminService.getAllVessels(); break;
                case 'vehicles': result = await adminService.getAllVehicles(); break;
                case 'equipment': result = await adminService.getAllEquipment(); break;
                case 'facilities': result = await adminService.getAllFacilities(); break;
                default: result = [];
            }
            setData(prev => ({ ...prev, [activeTab]: result || [] }));
        } catch (err) {
            setError(`Failed to load ${activeTab}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => { setModalMode('create'); setSelectedItem(null); setShowModal(true); };
    const handleEdit = (item) => { setModalMode('edit'); setSelectedItem(item); setShowModal(true); };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
        try {
            switch (activeTab) {
                case 'vessels': await adminService.deleteVessel(id); break;
                case 'vehicles': await adminService.deleteVehicle(id); break;
                case 'equipment': await adminService.deleteEquipment(id); break;
                case 'facilities': await adminService.deleteFacility(id); break;
            }
            await loadData();
        } catch (err) { setError(`Failed to delete: ${err.message}`); }
    };

    const handleSave = async (formData) => {
        try {
            if (modalMode === 'create') {
                switch (activeTab) {
                    case 'vessels': await adminService.createVessel(formData); break;
                    case 'vehicles': await adminService.createVehicle(formData); break;
                    case 'equipment': await adminService.createEquipment(formData); break;
                    case 'facilities': await adminService.createFacility(formData); break;
                }
            } else {
                switch (activeTab) {
                    case 'vessels': await adminService.updateVessel(selectedItem.id, formData); break;
                    case 'vehicles': await adminService.updateVehicle(selectedItem.id, formData); break;
                    case 'equipment': await adminService.updateEquipment(selectedItem.id, formData); break;
                    case 'facilities': await adminService.updateFacility(selectedItem.id, formData); break;
                }
            }
            setShowModal(false);
            await loadData();
        } catch (err) { throw new Error(err.message); }
    };

    const renderTable = () => {
        const currentData = data[activeTab] || [];
        if (loading) return <div className="loading">Loading {activeTab}...</div>;
        const columns = {
            vessels: ['Name', 'Registration', 'Type', 'Status', 'Home Port', 'Actions'],
            vehicles: ['Name', 'Registration', 'Type', 'Status', 'Location', 'Actions'],
            equipment: ['Name', 'Type', 'Model', 'Serial Number', 'Status', 'Actions'],
            facilities: ['Name', 'Type', 'Capacity', 'Location', 'Status', 'Actions']
        };
        return (
            <div className="table-container">
                <table className="data-table">
                    <thead><tr>{columns[activeTab].map(col => <th key={col}>{col}</th>)}</tr></thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr><td colSpan={columns[activeTab].length} className="no-data">No {activeTab} found</td></tr>
                        ) : (
                            currentData.map(item => (
                                <tr key={item.id}>
                                    {activeTab === 'vessels' && <><td>{item.name}</td><td>{item.registration_number}</td><td>{item.vessel_type}</td><td><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></td><td>{item.home_port}</td></>}
                                    {activeTab === 'vehicles' && <><td>{item.name}</td><td>{item.registration_number}</td><td>{item.vehicle_type}</td><td><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></td><td>{item.location}</td></>}
                                    {activeTab === 'equipment' && <><td>{item.name}</td><td>{item.equipment_type}</td><td>{item.model}</td><td>{item.serial_number}</td><td><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                                    {activeTab === 'facilities' && <><td>{item.name}</td><td>{item.facility_type}</td><td>{item.capacity}</td><td>{item.location}</td><td><span className={`status ${item.is_active ? 'active' : 'inactive'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td></>}
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="asset-management">
            <div className="page-header">
                <h1>Asset Management</h1>
                <button className="btn btn-primary" onClick={handleCreate}>Add {activeTab.slice(0, -1)}</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="tabs">
                <button className={`tab ${activeTab === 'vessels' ? 'active' : ''}`} onClick={() => setActiveTab('vessels')}>Vessels</button>
                <button className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles')}>Vehicles</button>
                <button className={`tab ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>Equipment</button>
                <button className={`tab ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}>Facilities</button>
            </div>
            <div className="content">{renderTable()}</div>
            {showModal && <AssetModal mode={modalMode} type={activeTab} item={selectedItem} onSave={handleSave} onClose={() => setShowModal(false)} />}
        </div>
    );
};

const AssetModal = ({ mode, type, item, onSave, onClose }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getInitialFormData = () => ({
        vessels: { name: '', registration_number: '', vessel_type: '', status: 'Available', home_port: '', notes: '' },
        vehicles: { name: '', registration_number: '', vehicle_type: '', status: 'Available', location: '', notes: '' },
        equipment: { name: '', equipment_type: '', model: '', serial_number: '', status: 'Available', notes: '' },
        facilities: { name: '', facility_type: '', capacity: '', location: '', is_active: true, notes: '' }
    }[type] || {});

    useEffect(() => {
        setFormData(mode === 'edit' && item ? { ...getInitialFormData(), ...item } : getInitialFormData());
    }, [mode, item, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try { await onSave(formData); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
    };

    return (
        <Modal onClose={onClose} title={`${mode === 'create' ? 'Create' : 'Edit'} ${type.slice(0, -1)}`}>
            <form onSubmit={handleSubmit} className="asset-form">
                {error && <div className="alert alert-error">{error}</div>}
                {type === 'vessels' && <>
                    <div className="form-row">
                        <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Registration Number</label><input type="text" name="registration_number" value={formData.registration_number || ''} onChange={handleChange} /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label>Vessel Type</label><select name="vessel_type" value={formData.vessel_type || ''} onChange={handleChange}><option value="">Select Type</option><option value="Rescue Vessel">Rescue Vessel</option><option value="Patrol Vessel">Patrol Vessel</option></select></div>
                        <div className="form-group"><label>Status</label><select name="status" value={formData.status || ''} onChange={handleChange}><option value="Available">Available</option><option value="In Service">In Service</option><option value="Maintenance">Maintenance</option></select></div>
                    </div>
                    <div className="form-group"><label>Home Port</label><input type="text" name="home_port" value={formData.home_port || ''} onChange={handleChange} /></div>
                </>}
                {type === 'vehicles' && <>
                    {/* Simplified for brevity */}
                    <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                </>}
                 {type === 'equipment' && <>
                    {/* Simplified for brevity */}
                    <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                </>}
                 {type === 'facilities' && <>
                    {/* Simplified for brevity */}
                    <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
                </>}
                <div className="form-group"><label>Notes</label><textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows="3" /></div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}</button>
                </div>
            </form>
        </Modal>
    );
};
export default AssetManagement;
