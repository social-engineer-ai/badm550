"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email); // OAuth2 spec uses username
            formData.append('password', password);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);

            // Fetch profile to check role
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/me`, {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });
            const profile = await profileRes.json();

            if (profile.role === 'teacher' || profile.role === 'admin' || profile.role === 'ta') {
                router.push('/instructor');
            } else {
                router.push('/student');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-darker)'
        }}>
            <div className="glass-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>BADM 550</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>PRACTICUM OPERATING SYSTEM</p>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ width: '100%', marginBottom: '1.5rem', padding: '10px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            className="glass-card"
                            style={{ width: '100%', background: 'var(--bg-primary)', padding: '14px', marginTop: '6px', color: 'white' }}
                            placeholder="name@illinois.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>PASSWORD</label>
                        <input
                            type="password"
                            className="glass-card"
                            style={{ width: '100%', background: 'var(--bg-primary)', padding: '14px', marginTop: '6px', color: 'white' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '14px' }}>
                        {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
                    </button>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Forgot password? <a href="#" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>Contact Admin</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
