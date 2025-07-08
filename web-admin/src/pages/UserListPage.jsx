import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
const UserListPage = () => {
    const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => { adminService.getAllUsers().then(setUsers).finally(() => setLoading(false)); }, []);
    if (loading) return <div>Loading members...</div>;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Member Management</h2>
                <button onClick={() => navigate('/users/new')}>+ Add New Member</button>
            </div>
            <table>
                <thead><tr><th>Name</th><th>AVCGA ID</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>{users.map(user => (
                    <tr key={user.id} onClick={() => navigate(`/users/${user.id}`)} style={{cursor: 'pointer'}}>
                        <td>{`${user.first_name} ${user.last_name}`}</td><td>{user.avcga_member_id}</td>
                        <td>{user.email}</td><td>{user.role}</td><td>{user.status}</td>
                    </tr>))}
                </tbody>
            </table>
        </div>
    );
};
export default UserListPage;
