import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const LoginPage = () => {
    const [email, setEmail] = useState('jason.archibald@archis-marine.online');
    const [password, setPassword] = useState('Password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();
    const handleSubmit = async (e) => { e.preventDefault(); setError(''); try { await auth.login(email, password); navigate("/dashboard"); } catch (err) { setError(err.message); }};
    return (
        <div style={{maxWidth: '400px', margin: '5rem auto'}}>
            <h2>Admin Portal Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email"/>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password"/>
                {error && <p className="error">{error}</p>}
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};
export default LoginPage;
