import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Modal from './Modal';
import './RosterManagement.css';

const RosterManagement = () => {
    const [rosters, setRosters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedRoster, setSelectedRoster] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { loadRosters(); }, []);
    const loadRosters = async () => {
        setLoading(true); setError('');
        try { const data = await adminService.getRosters(); setRosters(data || []); } 
        catch (err) { setError(`Failed to load rosters: ${err.message}`); } 
        finally { setLoading(false); }
    };

    const handleCreate = () => { setModalMode('create'); setSelectedRoster(null); setShowModal(true); };
    const handleEdit = (roster) => { setModalMode('edit'); setSelectedRoster(roster); setShowModal(true); };
    const handleView = (roster) => { setModalMode('view'); setSelectedRoster(roster); setShowModal(true); };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this roster?')) {
            try { await adminService.deleteRoster(id); await loadRosters(); } 
            catch (err) { setError(`Failed to delete roster: ${err.message}`); }
        }
    };
    const handleSave = async (formData) => {
        try {
            if (modalMode === 'create') await adminService.createRoster(formData);
            else await adminService.updateRoster(selectedRoster.id, formData);
            setShowModal(false); await loadRosters();
        } catch (err) { throw new Error(err.message); }
    };

    return (
        <div className="roster-management">
            <div className="page-header">
                <h1>Roster Management</h1>
                <button className="btn btn-primary" onClick={handleCreate}>Create Roster</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="content">
                {loading ? <div className="loading">Loading rosters...</div> : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Assigned</th><th>Actions</th></tr></thead>
                            <tbody>
                                {rosters.length === 0 ? (
                                    <tr><td colSpan="7" className="no-data">No rosters found</td></tr>
                                ) : (
                                    rosters.map(roster => (
                                        <tr key={roster.id}>
                                            <td>{roster.name}</td><td>{roster.roster_type}</td><td>{new Date(roster.start_datetime).toLocaleDateString()}</td><td>{new Date(roster.end_datetime).toLocaleDateString()}</td>
                                            <td><span className={`status ${roster.status?.toLowerCase()}`}>{roster.status}</span></td><td>{roster.assigned_members || 0}</td>
                                            <td>
                                                <div className="actions">
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleView(roster)}>View</button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(roster)}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(roster.id)}>Delete</button>
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
            {showModal && <RosterModal mode={modalMode} roster={selectedRoster} onSave={handleSave} onClose={() => setShowModal(false)} />}
        </div>
    );
};

const RosterModal = ({ mode, roster, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', roster_type: '', start_datetime: '', end_datetime: '', status: 'Draft', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isReadOnly = mode === 'view';

    useEffect(() => {
        if (roster) { setFormData({ ...roster, start_datetime: roster.start_datetime?.slice(0, 16), end_datetime: roster.end_datetime?.slice(0, 16) }); }
    }, [roster]);

    const handleSubmit = async (e) => {
        e.preventDefault(); if (isReadOnly) { onClose(); return; }
        setLoading(true); setError('');
        try { await onSave(formData); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <Modal onClose={onClose} title={`${mode} Roster`.replace(/^\w/, c => c.toUpperCase())}>
            <form onSubmit={handleSubmit} className="roster-form">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required readOnly={isReadOnly}/></div>
                <div className="form-group"><label>Start Date & Time *</label><input type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} required readOnly={isReadOnly}/></div>
                <div className="form-group"><label>End Date & Time *</label><input type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} required readOnly={isReadOnly}/></div>
                <div className="form-group"><label>Status</label><select name="status" value={formData.status} onChange={handleChange} disabled={isReadOnly}><option value="Draft">Draft</option><option value="Published">Published</option><option value="Active">Active</option></select></div>
                <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" readOnly={isReadOnly}/></div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{isReadOnly ? 'Close' : 'Cancel'}</button>
                    {!isReadOnly && <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>}
                </div>
            </form>
        </Modal>
    );
};
export default RosterManagement;
