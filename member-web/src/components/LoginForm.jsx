import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
    const [email, setEmail] = useState('jason.archibald@archis-marine.online');
    const [password, setPassword] = useState('Archie1977');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResetMessage('');

        try {
            const response = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });

            const data = await response.json();
            
            if (response.ok) {
                setResetMessage(data.message);
                if (data.developmentToken) {
                    setResetMessage(prev => `${prev} (Development token: ${data.developmentToken})`);
                }
            } else {
                setError(data.message || 'Error sending reset email');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (showForgotPassword) {
        return (
            <div style={{
                maxWidth: '400px',
                margin: '100px auto',
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Reset Password</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {error}
                    </div>
                )}

                {resetMessage && (
                    <div style={{
                        backgroundColor: '#efe',
                        color: '#262',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {resetMessage}
                    </div>
                )}

                <form onSubmit={handleForgotPassword}>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '4px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '15px'
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Member Portal Login</h2>

            {error && (
                <div style={{
                    backgroundColor: '#fee',
                    color: '#c33',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '4px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '4px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
