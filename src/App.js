import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [vitals, setVitals] = useState([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        // Points to LIVE Render Backend
        const response = await axios.get('https://health-backend-v2.onrender.com/api/vitals/');
        setVitals(response.data);
        
        if (response.data.length > 0 && response.data[0].heartRate > 100) {
          setIsAlarmActive(true);
        }
      } catch (error) {
        console.error("Error fetching vitals:", error);
      }
    };

    const interval = setInterval(fetchVitals, 2000);
    return () => clearInterval(interval);
  }, []);

  const resetAlarm = async () => {
    try {
      await axios.post('https://health-backend-v2.onrender.com/api/reset-alarm/');
      setIsAlarmActive(false);
    } catch (error) {
      console.error("Error resetting alarm:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🏥 Smart Health Monitor</h1>
      
      {isAlarmActive && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          🚨 CRITICAL: High Heart Rate Detected! Hardware Alarm is ON.
          <button onClick={resetAlarm} style={{ marginLeft: '20px', padding: '5px 10px', cursor: 'pointer' }}>
            Reset Alarm (Send Command to Hardware)
          </button>
        </div>
      )}

      <h2>Live Vitals (From Hardware)</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Time</th>
            <th>Heart Rate (BPM)</th>
            <th>Temperature (°C)</th>
          </tr>
        </thead>
        <tbody>
          {vitals.map((v, index) => (
            <tr key={index} style={{ backgroundColor: v.heartRate > 100 ? '#ffcccc' : 'white' }}>
              <td>{new Date(v.time).toLocaleTimeString()}</td>
              <td>{v.heartRate}</td>
              <td>{v.temperature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;