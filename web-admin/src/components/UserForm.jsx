import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const isEditing = Boolean(userId);
    
    const [formData, setFormData] = useState({
        avcga_member_id: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_primary: '',
        phone_secondary: '',
        role: 'Member',
        status: 'Active',
        join_date: new Date().toISOString().split('T')[0],
        emergency_contact_name: '',
        emergency_contact_phone: '',
        address: '',
        postal_code: '',
        personal_notes: '',
        flotilla_id: '',
        password: isEditing ? '' : 'Password123'
    });

    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load flotillas for dropdown
    useEffect(() => {
        const loadFlotillas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/users/flotillas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFlotillas(data);
                    
                    // Set default flotilla (admin's flotilla) if creating new user
                    if (!isEditing && data.length > 0) {
                        const profileResponse = await fetch('/api/users/me/profile', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        if (profileResponse.ok) {
                            const profile = await profileResponse.json();
                            if (profile.flotilla_id) {
                                setFormData(prev => ({ ...prev, flotilla_id: profile.flotilla_id }));
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error loading flotillas:', err);
            }
        };

        loadFlotillas();
    }, [isEditing]);

    // Load user data if editing
    useEffect(() => {
        if (isEditing) {
            const loadUser = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/users/${userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        setFormData({
                            ...userData,
                            join_date: userData.join_date ? userData.join_date.split('T')[0] : '',
                            password: ''
                        });
                    } else {
                        setError('User not found');
                    }
                } catch (err) {
                    setError('Error loading user data');
                }
            };

            loadUser();
        }
    }, [isEditing, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = isEditing ? `/api/users/${userId}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';
            
            const submitData = { ...formData };
            if (isEditing && !submitData.password) {
                delete submitData.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                navigate('/admin/users');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error saving user');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>{isEditing ? 'Edit User' : 'Create New User'}</h2>
            
            {error && (
                <div style={{ 
                    backgroundColor: '#fee', 
                    color: '#c33', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label>AVCGA Member ID</label>
                        <input
                            type="text"
                            name="avcga_member_id"
                            value={formData.avcga_member_id}
                            onChange={handleChange}
                            placeholder="e.g., VF04-002"
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>

                    <div>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>

                    <div>
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>

                    <div>
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>

                    <div>
                        <label>Role *</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        >
                            <option value="Member">Member</option>
                            <option value="CrewLeader">Crew Leader</option>
                            <option value="Trainer">Trainer</option>
                            <option value="FlotillaCommander">Flotilla Commander</option>
                            <option value="SquadronCommander">Squadron Commander</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                    </div>

                    <div>
                        <label>Flotilla *</label>
                        <select
                            name="flotilla_id"
                            value={formData.flotilla_id}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        >
                            <option value="">Select Flotilla</option>
                            {flotillas.map(flotilla => (
                                <option key={flotilla.id} value={flotilla.id}>
                                    {flotilla.name} ({flotilla.squadron_name})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Primary Phone</label>
                        <input
                            type="tel"
                            name="phone_primary"
                            value={formData.phone_primary}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>

                    <div>
                        <label>Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        >
                            <option value="Active">Active</option>
                            <option value="OnLeave">On Leave</option>
                            <option value="Pending">Pending</option>
                            <option value="Resigned">Resigned</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
