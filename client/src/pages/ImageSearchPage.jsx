// src/pages/ImageSearchPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4081' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ImageSearchPage() {
  const [term, setTerm] = useState('');
  const [images, setImages] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    fetchTop();
    fetchHistory();
  }, []);

  async function fetchTop() {
    try {
      const res = await API.get('/api/top-searches');
      setTopSearches(res.data);
    } catch (e) { console.error(e); }
  }

  async function fetchHistory() {
    try {
      const res = await API.get('/api/history');
      setHistory(res.data);
    } catch (e) { console.error(e); }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!term.trim()) return;
    const res = await API.post('/api/search', { term });
    setImages(res.data.images);
    fetchTop();
    fetchHistory();
    setSelected(new Set());
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ flex: 1 }}>
        <div>
          <strong>Top Searches:</strong>{' '}
          {topSearches.map(t => (
            <button key={t.term} onClick={() => setTerm(t.term)} style={{ margin: 5 }}>
              {t.term} ({t.count})
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch}>
          <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Search images..." />
          <button type="submit">Search</button>
        </form>

        <p>Selected: {selected.size} images</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
          }}
        >
          {images.map(img => (
            <div key={img.id} style={{ position: 'relative' }}>
              <img
                src={img.thumb}
                alt={img.alt}
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
              />
              <label style={{ position: 'absolute', top: 8, left: 8 }}>
                <input
                  type="checkbox"
                  checked={selected.has(img.id)}
                  onChange={() => toggleSelect(img.id)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 250 }}>
        <h4>Your Search History</h4>
        {history.map((h, i) => (
          <div key={i} style={{ borderBottom: '1px solid #eee', padding: 6 }}>
            <div>{h.term}</div>
            <div style={{ fontSize: 12, color: '#555' }}>
              {new Date(h.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
