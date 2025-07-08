import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminService from '../services/adminService';

const UserFormPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(userId);

    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'Member', status: 'Active', flotilla_id: '', avcga_member_id: '' });
    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        adminService.getFlotillas().then(setFlotillas).catch(() => setError('Could not load flotillas.'));
        if (isEditing) {
            setLoading(true);
            adminService.getUserById(userId)
                .then(user => setFormData({ ...user, password: '' }))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [userId, isEditing]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const dataToSubmit = { ...formData };
            if (isEditing && !dataToSubmit.password) {
                delete dataToSubmit.password;
            } else if (!isEditing && !dataToSubmit.password) {
                throw new Error('Password is required for new members.');
            }
            if (isEditing) { await adminService.updateUser(userId, dataToSubmit); }
            else { await adminService.createUser(dataToSubmit); }
            navigate('/users');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };
    
    if (loading && isEditing) return <div>Loading form...</div>;

    return (
        <div>
            <Link to="/users">← Back to Member List</Link>
            <h2>{isEditing ? `Edit Member: ${formData.first_name} ${formData.last_name}` : 'Create New Member'}</h2>
            <form onSubmit={handleSubmit}>
                <input name="first_name" value={formData.first_name || ''} onChange={handleChange} placeholder="First Name" required />
                <input name="last_name" value={formData.last_name || ''} onChange={handleChange} placeholder="Last Name" required />
                <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email Address" required />
                <input name="password" type="password" value={formData.password || ''} onChange={handleChange} placeholder={isEditing ? 'New Password (leave blank to keep)' : 'Password'} required={!isEditing} />
                <input name="avcga_member_id" value={formData.avcga_member_id || ''} onChange={handleChange} placeholder="AVCGA Member ID" />
                <select name="flotilla_id" value={formData.flotilla_id || ''} onChange={handleChange}>
                    <option value="">-- No Assigned Flotilla --</option>
                    {flotillas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Member">Member</option><option value="FlotillaExecutive">Flotilla Executive</option>
                    <option value="SquadronCommander">Squadron Commander</option><option value="SuperAdmin">Super Admin</option>
                </select>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option><option value="OnLeave">On Leave</option>
                    <option value="Pending">Pending</option><option value="Resigned">Resigned</option>
                </select>
                <div style={{marginTop: '1.5rem'}}>
                    {error && <p className="error">{error}</p>}
                    <button type="button" onClick={() => navigate(-1)} style={{marginRight: '1rem', background: '#555'}}>Cancel</button>
                    <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Member'}</button>
                </div>
            </form>
        </div>
    );
};
export default UserFormPage;
