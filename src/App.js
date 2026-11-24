import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [readings, setReadings] = useState([]);
  const [isAlertActive, setIsAlertActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/water/latest/`);
        setReadings(res.data);
        if (res.data.length > 0) {
          const latest = res.data[0];
          if (latest.turbidity > 5 || latest.ph < 6.5 || latest.ph > 8.5) {
            setIsAlertActive(true);
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const dispatch = async () => {
    await axios.post(`${API_BASE}/api/water/dispatch/`);
    setIsAlertActive(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>💧 Ethiopia Water Quality Monitor</h1>
      {isAlertActive && (
        <div style={{ background: 'red', color: '#fff', padding: 15, marginBottom: 20, borderRadius: 5 }}>
          ⚠️ Water quality alert: turbidity or pH out of safe range!
          <button onClick={dispatch} style={{ marginLeft: 20, padding: '8px 16px', cursor: 'pointer' }}>
            Dispatch Maintenance
          </button>
        </div>
      )}
      <h2>Live Readings</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead><tr><th>Time</th><th>Turbidity (NTU)</th><th>pH</th></tr></thead>
        <tbody>
          {readings.map((r, i) => (
            <tr key={i} style={{ background: r.turbidity > 5 || r.ph < 6.5 || r.ph > 8.5 ? '#ffcccc' : 'white' }}>
              <td>{new Date(r.time).toLocaleTimeString()}</td>
              <td>{r.turbidity}</td>
              <td>{r.ph}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;