// src/pages/Login.jsx
import React from 'react';

export default function Login() {
  const oauth = [
    { label: 'Google', url: 'http://localhost:4081/auth/google' },
    { label: 'GitHub',  url: 'http://localhost:4081/auth/github' },
    { label: 'Facebook',url: 'http://localhost:4081/auth/facebook' }
  ];

  return (
    <div style={{padding:20}}>
      <h2>Login to search images</h2>
      {oauth.map(s => (
        <a key={s.label} href={s.url} style={{display:'inline-block', margin:'8px', padding:'8px 12px', border:'1px solid #ccc', borderRadius:6}}>
          Continue with {s.label}
        </a>
      ))}
    </div>
  );
}
