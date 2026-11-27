
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
const API_BASE = 'https://smart-home-backend.onrender.com';

function App() {
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/home/devices/`);
      setDevices(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggle = async (deviceId, currentStatus) => {
    const action = currentStatus ? 'OFF' : 'ON';
    try {
      await axios.post(`${API_BASE}/api/home/toggle/`, {
        device_id: deviceId,
        action: action
      });
      fetchDevices();
    } catch (error) {
      console.error("Error toggling device:", error);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>🇪🇹 Ethiopian Smart Home</h1>
      <p style={{ color: '#666' }}>Voice & Gesture Controlled (Simulated)</p>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        {devices.map(d => (
          <div key={d.id} style={{
            border: '1px solid #ccc', padding: 20, borderRadius: 8, minWidth: '200px',
            background: d.status ? '#e8f5e9' : '#fafafa'
          }}>
            <h3>{d.name}</h3>
            <p>Status: <strong>{d.status ? 'ON' : 'OFF'}</strong></p>
            <button 
              onClick={() => toggle(d.id, d.status)}
              style={{ padding: '8px 16px', cursor: 'pointer', width: '100%' }}
            >
              Turn {d.status ? 'OFF' : 'ON'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;