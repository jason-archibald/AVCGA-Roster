const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: 'User not found' });
        const user = result.rows[0];
        if (password !== user.password) return res.status(401).json({ message: 'Invalid credentials' });
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.first_name } });
    } catch (err) { console.error(`SERVER ERROR: ${err.message}`); res.status(500).send('Server Error'); }
};
module.exports = { loginUser };
