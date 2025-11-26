import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/alerts.css';


function Alerts() {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/alerts?sort=banner&filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE',
      );
      if (result.data.data.length > 0) {
        setAlert(result.data.data[0]);
      }
    }
    fetchData();
  }, []);

  if (!alert || !isVisible) {
    return null;
  }

  return (
    <div className="alert-banner">
      <div className="alert-text">
        <strong>{alert.attributes.header}</strong> - {alert.attributes.description}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="close-button"
        aria-label="Close alert"
      >
        x
      </button>
    </div>
  );
}


export default Alerts;