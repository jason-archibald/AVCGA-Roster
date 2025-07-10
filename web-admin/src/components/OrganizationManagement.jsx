import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Modal from './Modal';
import './OrganizationManagement.css';

const OrganizationManagement = () => {
    const [activeTab, setActiveTab] = useState('squadrons');
    const [squadrons, setSquadrons] = useState([]);
    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create, edit
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'squadrons') {
                const data = await adminService.getSquadrons();
                setSquadrons(data || []);
            } else {
                const data = await adminService.getFlotillas();
                setFlotillas(data || []);
            }
        } catch (err) {
            setError(`Failed to load ${activeTab}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedItem(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit');
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
            return;
        }

        try {
            if (activeTab === 'squadrons') {
                await adminService.deleteSquadron(id);
            } else {
                await adminService.deleteFlotilla(id);
            }
            await loadData();
        } catch (err) {
            setError(`Failed to delete: ${err.message}`);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (modalMode === 'create') {
                if (activeTab === 'squadrons') {
                    await adminService.createSquadron(formData);
                } else {
                    await adminService.createFlotilla(formData);
                }
            } else {
                if (activeTab === 'squadrons') {
                    await adminService.updateSquadron(selectedItem.id, formData);
                } else {
                    await adminService.updateFlotilla(selectedItem.id, formData);
                }
            }
            setShowModal(false);
            await loadData();
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const currentData = activeTab === 'squadrons' ? squadrons : flotillas;

    return (
        <div className="organization-management">
            <div className="page-header">
                <h1>Organization Management</h1>
                <button 
                    className="btn btn-primary"
                    onClick={handleCreate}
                >
                    Add {activeTab === 'squadrons' ? 'Squadron' : 'Flotilla'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'squadrons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('squadrons')}
                >Squadrons</button>
                <button 
                    className={`tab ${activeTab === 'flotillas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flotillas')}
                >Flotillas</button>
            </div>

            <div className="content">
                {loading ? ( <div className="loading">Loading {activeTab}...</div> ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th><th>Code</th><th>Location</th><th>Commander</th><th>Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length === 0 ? (
                                    <tr><td colSpan="6" className="no-data">No {activeTab} found</td></tr>
                                ) : (
                                    currentData.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.code}</td>
                                            <td>{item.location}</td>
                                            <td>{item.commander_name || 'Not Assigned'}</td>
                                            <td><span className={`status ${item.is_active ? 'active' : 'inactive'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td>
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
                )}
            </div>

            {showModal && (
                <OrganizationModal
                    mode={modalMode}
                    type={activeTab}
                    item={selectedItem}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

const OrganizationModal = ({ mode, type, item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '', code: '', location: '', commander_id: '', deputy_commander_id: '', parent_squadron_id: '',
        is_active: true, contact_email: '', contact_phone: '', notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && item) {
            setFormData({
                name: item.name || '', code: item.code || '', location: item.location || '',
                commander_id: item.commander_id || '', deputy_commander_id: item.deputy_commander_id || '',
                parent_squadron_id: item.parent_squadron_id || '', is_active: item.is_active !== false,
                contact_email: item.contact_email || '', contact_phone: item.contact_phone || '', notes: item.notes || ''
            });
        }
    }, [mode, item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try { await onSave(formData); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
    };

    return (
        <Modal onClose={onClose} title={`${mode === 'create' ? 'Create' : 'Edit'} ${type.slice(0, -1)}`}>
            <form onSubmit={handleSubmit} className="organization-form">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-row">
                    <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Code *</label><input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g., VF04"/></div>
                </div>
                <div className="form-group"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Westernport"/></div>
                <div className="form-row">
                    <div className="form-group"><label>Contact Email</label><input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} /></div>
                    <div className="form-group"><label>Contact Phone</label><input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} /></div>
                </div>
                {type === 'flotillas' && (
                    <div className="form-group"><label>Parent Squadron</label><select name="parent_squadron_id" value={formData.parent_squadron_id} onChange={handleChange}><option value="">Select Squadron</option></select></div>
                )}
                <div className="form-group"><label>Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" /></div>
                <div className="form-group"><label><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Active</label></div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}</button>
                </div>
            </form>
        </Modal>
    );
};

export default OrganizationManagement;
