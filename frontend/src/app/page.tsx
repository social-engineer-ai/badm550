import React from 'react';

export default function HomePage() {
  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Welcome back, Prof. Khandelwal</h1>
          <p>Here's what's happening with your teams today.</p>
        </div>
        <button className="btn btn-primary">+ New Alert</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Alert Queue</h3>
          <p style={{ margin: '1rem 0' }}>3 teams require immediate attention.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <strong style={{ display: 'block' }}>AWG-3: Missing Check-in</strong>
              <small>2 days overdue • Priority High</small>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Draft Queue</h3>
          <p style={{ margin: '1rem 0' }}>8 pending drafts for review.</p>
          <button className="btn btn-primary" style={{ width: '100%' }}>Review All</button>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Team Health</h3>
          <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '8px' }}>
            <div style={{ height: '80%', width: '20px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
            <div style={{ height: '95%', width: '20px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
            <div style={{ height: '40%', width: '20px', background: '#ef4444', borderRadius: '4px' }}></div>
            <div style={{ height: '70%', width: '20px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
            <div style={{ height: '85%', width: '20px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Overall Course Sentiment: Positive</p>
        </div>
      </div>
    </div>
  );
}
