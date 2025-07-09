const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        const user = result.rows[0];
        
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'Active') {
            return res.status(401).json({ message: 'Account is not active' });
        }
        
        await userModel.updateLastLogin(user.id);
        
        const payload = { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            flotilla_id: user.flotilla_id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            flotilla_id: user.flotilla_id
        };
        
        res.json({ 
            token, 
            user: userResponse,
            message: 'Login successful'
        });
        
    } catch (err) {
        console.error(`SERVER ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
};

module.exports = { loginUser };
