const userModel = require('../models/userModel');
const pool = require('../config/db'); // For ad-hoc queries

// @desc    Get all users for the admin list
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error(`Error in getAllUsers: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get a single user's full profile by ID (for admins)
const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password; // Never send password/hash
        // Add other related data here in the future, e.g., qualifications
        res.status(200).json(user);
    } catch (err) {
        console.error(`Error in getUserById: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a new user (for admins)
const createUser = async (req, res) => {
    try {
        // Ensure a default password if none is provided
        if (!req.body.password) {
            req.body.password = 'Password123';
        }
        const newUser = await userModel.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(`Error in createUser: ${err.message}`);
        if (err.code === '23505') { // Postgres code for unique violation
            return res.status(400).json({ message: 'User with this email or Member ID already exists.' });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get the currently logged-in user's own profile
const getMyProfile = async (req, res) => {
    try {
        // req.user.id is attached by the 'protect' middleware
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password; // Never send password/hash
        res.status(200).json(user);
    } catch (err) {
        console.error(`Error in getMyProfile: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// THIS IS THE CRITICAL FIX: Ensure all functions are exported.
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    getMyProfile
    // Add updateUser and deleteUser here when they are implemented
};
