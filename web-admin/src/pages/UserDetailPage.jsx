import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
const UserDetailPage = () => {
    const { userId } = useParams(); const navigate = useNavigate();
    const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
    useEffect(() => { adminService.getUserById(userId).then(setUser).finally(() => setLoading(false)); }, [userId]);
    const handleDelete = async () => {
        if (window.confirm(`Delete ${user.first_name}? This cannot be undone.`)) {
            try { await adminService.deleteUser(userId); navigate('/users'); }
            catch (err) { alert(err.message); }
        }
    };
    if (loading) return <div>Loading details...</div>;
    if (!user) return <div>Member not found.</div>;
    return (
        <div>
            <Link to="/users">← Back to Member List</Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{user.first_name} {user.last_name}</h2>
                <div>
                    <button onClick={() => navigate(`/users/edit/${userId}`)} style={{marginRight: '1rem'}}>Edit</button>
                    <button onClick={handleDelete} style={{backgroundColor: '#c0392b'}}>Delete</button>
                </div>
            </div>
            <div className="card"><h3>Details</h3><p><strong>Email:</strong> {user.email}</p><p><strong>Role:</strong> {user.role}</p></div>
        </div>
    );
};
export default UserDetailPage;
