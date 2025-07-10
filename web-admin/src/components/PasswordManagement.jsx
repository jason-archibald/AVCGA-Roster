import React, { useState } from 'react';
import authService from '../services/authService';
import './PasswordManagement.css';

const PasswordManagement = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(''); setMessage('');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) { setError('New passwords do not match'); return; }
        if (formData.newPassword.length < 8) { setError('Password must be at least 8 characters long'); return; }
        setLoading(true); setError(''); setMessage('');
        try {
            await authService.changePassword(formData.currentPassword, formData.newPassword);
            setMessage('Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-management">
            <div className="page-header"><h1>Password Management</h1></div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <div className="content">
                <div className="password-change-form">
                    <h2>Change Your Password</h2>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group"><label>Current Password *</label><input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required /></div>
                        <div className="form-group"><label>New Password *</label><input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required minLength="8" /><small>Password must be at least 8 characters long</small></div>
                        <div className="form-group"><label>Confirm New Password *</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required /></div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default PasswordManagement;
