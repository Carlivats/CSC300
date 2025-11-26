import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
    <div style={{
      width: '100%',
      backgroundColor: '#da636cff',
      borderBottom: '2px solid #dc3545',
      color: 'white',
      padding: '10px 0',
      fontSize: '16px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        whiteSpace: 'nowrap',
        animation: 'scroll-left 20s linear infinite',
        display: 'inline-block'
      }}>
        <strong>{alert.attributes.header}</strong> - {alert.attributes.description}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          right: '50px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#7009118e',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          width: '32px',
          height: '32px',
          fontSize: '22px',
          cursor: 'pointer',
          padding: '0',
          paddingBottom: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1'
        }}
        aria-label="Close alert"
      >
        x
      </button>
      <style>
        {`
          @keyframes scroll-left {
            0% {
              transform: translateX(100vw);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
}


export default Alerts;