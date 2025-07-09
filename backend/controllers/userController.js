const userModel = require('../models/userModel');
const pool = require('../config/db');
const crypto = require('crypto');

// Helper function to exclude password
const excludePassword = (user) => {
    if (user && user.password) {
        delete user.password;
    }
    return user;
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        const safeUsers = users.map(excludePassword);
        res.status(200).json(safeUsers);
    } catch (err) {
        console.error(`Error in getAllUsers: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(excludePassword(user));
    } catch (err) {
        console.error(`Error in getUserById: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const createUser = async (req, res) => {
    try {
        // Get admin's flotilla as default if no flotilla specified
        if (!req.body.flotilla_id && req.user && req.user.id) {
            const adminUser = await userModel.findById(req.user.id);
            if (adminUser && adminUser.flotilla_id) {
                req.body.flotilla_id = adminUser.flotilla_id;
            }
        }
        
        // Default password
        if (!req.body.password) {
            req.body.password = 'Password123';
        }
        
        const newUser = await userModel.create(req.body);
        res.status(201).json(excludePassword(newUser));
    } catch (err) {
        console.error(`Error in createUser: ${err.message}`);
        if (err.code === '23505') {
            return res.status(400).json({ message: 'User with this email or Member ID already exists.' });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

const updateUser = async (req, res) => {
    try {
        delete req.body.password; // Use separate endpoint for password
        
        const updatedUser = await userModel.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(excludePassword(updatedUser));
    } catch (err) {
        console.error(`Error in updateUser: ${err.message}`);
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Email or Member ID already exists.' });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role === 'SuperAdmin') {
            return res.status(400).json({ message: 'Cannot delete SuperAdmin users' });
        }
        
        await userModel.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(`Error in deleteUser: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(excludePassword(user));
    } catch (err) {
        console.error(`Error in getMyProfile: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        delete req.body.role;
        delete req.body.status;
        delete req.body.password;
        
        const updatedUser = await userModel.update(req.user.id, req.body);
        res.status(200).json(excludePassword(updatedUser));
    } catch (err) {
        console.error(`Error in updateMyProfile: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const targetUserId = req.params.id || req.user.id;
        
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        // If changing someone else's password, must be admin
        if (targetUserId !== req.user.id && !['SuperAdmin', 'SquadronCommander'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to change this password' });
        }
        
        // If changing own password, verify current password
        if (targetUserId === req.user.id && currentPassword) {
            const user = await userModel.findById(req.user.id);
            if (user.password !== currentPassword) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }
        
        await userModel.update(targetUserId, { password: newPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(`Error in changePassword: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(200).json({ message: 'If email exists, password reset instructions have been sent' });
        }
        
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        
        await pool.query(`
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `, [user.id, token, expiresAt]);
        
        console.log(`Password reset token for ${email}: ${token}`);
        
        res.status(200).json({ 
            message: 'If email exists, password reset instructions have been sent',
            developmentToken: token // Remove in production
        });
    } catch (err) {
        console.error(`Error in requestPasswordReset: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        const tokenResult = await pool.query(`
            SELECT pt.*, u.email, u.first_name
            FROM password_reset_tokens pt
            JOIN users u ON pt.user_id = u.id
            WHERE pt.token = $1 AND pt.expires_at > NOW() AND pt.used_at IS NULL
        `, [token]);
        
        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        
        const tokenData = tokenResult.rows[0];
        
        await userModel.update(tokenData.user_id, { password: newPassword });
        
        await pool.query(`
            UPDATE password_reset_tokens 
            SET used_at = NOW() 
            WHERE token = $1
        `, [token]);
        
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(`Error in resetPassword: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

const getFlotillas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT f.id, f.name, f.location, s.name as squadron_name
            FROM flotillas f
            LEFT JOIN squadrons s ON f.squadron_id = s.id
            ORDER BY s.name, f.name
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(`Error in getFlotillas: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    getFlotillas
};
