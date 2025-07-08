import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

const UserDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await adminService.getUserById(userId);
                setUser(userData);
            } catch (err) {
                setError('Failed to load user details');
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) return <div>Loading user details...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Member Details</h2>
                <div>
                    <button onClick={() => navigate(`/users/edit/${userId}`)} style={{ marginRight: '1rem' }}>
                        Edit Member
                    </button>
                    <button onClick={() => navigate('/users')}>
                        Back to List
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h3>Personal Information</h3>
                        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>AVCGA ID:</strong> {user.avcga_member_id}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Status:</strong> {user.status}</p>
                    </div>
                    <div>
                        <h3>Contact Information</h3>
                        <p><strong>Primary Phone:</strong> {user.phone_primary || 'Not provided'}</p>
                        <p><strong>Secondary Phone:</strong> {user.phone_secondary || 'Not provided'}</p>
                        <p><strong>Join Date:</strong> {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                </div>
                
                {user.personal_notes && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Notes</h3>
                        <p>{user.personal_notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailPage;
