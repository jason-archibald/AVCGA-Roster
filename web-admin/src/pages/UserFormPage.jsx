import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

const UserFormPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(userId);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        avcga_member_id: '',
        role: 'Member',
        status: 'Active',
        phone_primary: '',
        phone_secondary: '',
        join_date: '',
        personal_notes: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const user = await adminService.getUserById(userId);
                    setFormData({
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        email: user.email || '',
                        avcga_member_id: user.avcga_member_id || '',
                        role: user.role || 'Member',
                        status: user.status || 'Active',
                        phone_primary: user.phone_primary || '',
                        phone_secondary: user.phone_secondary || '',
                        join_date: user.join_date || '',
                        personal_notes: user.personal_notes || ''
                    });
                } catch (err) {
                    setError('Failed to load user data');
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [isEdit, userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEdit) {
                await adminService.updateUser(userId, formData);
            } else {
                await adminService.createUser(formData);
            }
            navigate('/users');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) return <div>Loading user data...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{isEdit ? 'Edit Member' : 'Add New Member'}</h2>
                <button onClick={() => navigate('/users')}>
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '600px'
            }}>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '1rem' }}
                />

                <input
                    type="text"
                    name="avcga_member_id"
                    placeholder="AVCGA Member ID"
                    value={formData.avcga_member_id}
                    onChange={handleChange}
                    style={{ marginBottom: '1rem' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="Member">Member</option>
                        <option value="FlotillaExecutive">Flotilla Executive</option>
                        <option value="SquadronCommander">Squadron Commander</option>
                        <option value="SuperAdmin">Super Admin</option>
                    </select>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="OnLeave">On Leave</option>
                        <option value="Pending">Pending</option>
                        <option value="Resigned">Resigned</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="tel"
                        name="phone_primary"
                        placeholder="Primary Phone"
                        value={formData.phone_primary}
                        onChange={handleChange}
                    />
                    <input
                        type="tel"
                        name="phone_secondary"
                        placeholder="Secondary Phone"
                        value={formData.phone_secondary}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="date"
                    name="join_date"
                    placeholder="Join Date"
                    value={formData.join_date}
                    onChange={handleChange}
                    style={{ marginBottom: '1rem' }}
                />

                <textarea
                    name="personal_notes"
                    placeholder="Personal Notes"
                    value={formData.personal_notes}
                    onChange={handleChange}
                    rows="3"
                    style={{ marginBottom: '1rem', resize: 'vertical' }}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEdit ? 'Update Member' : 'Create Member')}
                </button>
            </form>
        </div>
    );
};

export default UserFormPage;
