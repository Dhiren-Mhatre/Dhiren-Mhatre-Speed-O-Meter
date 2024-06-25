import React, { useState, useEffect, CSSProperties } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
interface Speed {
  download: number;
  upload: number;
}

const PopupSpeedMonitor: React.FC = () => {
  const [speed, setSpeed] = useState<Speed>({ download: 0, upload: 0 });
  const [latency, setLatency] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<string>('');

  useEffect(() => {
    const measureSpeed = async () => {
      const startTime = new Date().getTime();
      const image = new Image();
      image.src = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' + '?' + startTime;
      image.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = 92000 * 8; // 92 KB image size, assuming 1 byte = 8 bits
        const speedBps = bitsLoaded / duration;
        const speedKBps = speedBps / 1024; // Convert to KBps (kilobytes per second)
        setSpeed({ download: parseFloat(speedKBps.toFixed(2)), upload: parseFloat((speedKBps / 2).toFixed(2)) });
        setLatency(duration * 1000); // Convert to milliseconds
      };
    };

    const updateConnectionType = () => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        setConnectionType((navigator as any).connection.effectiveType || '');
      }
    };

    measureSpeed();
    updateConnectionType();
    const interval = setInterval(measureSpeed, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseWindow = () => {
    window.close();
  };

  const handleMouseEnter = () => {
    // Add hover effect styles here
    setCloseButtonHovered(true);
  };

  const handleMouseLeave = () => {
    // Remove hover effect styles here
    setCloseButtonHovered(false);
  };

  const [closeButtonHovered, setCloseButtonHovered] = useState(false);

  return (
    <div style={styles.container as CSSProperties}>
      <div style={styles.dragRegion as CSSProperties}>
        <h1 style={styles.title as CSSProperties}>Speed Monitor</h1>
        <button
          onClick={handleCloseWindow}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            ...styles.closeButton as CSSProperties,
            backgroundColor: closeButtonHovered ? '#aaa' : '#ccc',
            transform: closeButtonHovered ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          X
        </button>
        <div style={styles.info as CSSProperties}>
          <p>Download: {speed.download} KBps</p>
          <p>Upload: {speed.upload} KBps</p>
          <p>Latency: {latency} ms</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    position: 'relative' as 'relative', // TypeScript compatible string literals
    overflow: 'hidden' as 'hidden',
  },
  info: {
    transform: 'translate(0px,-40px)',
    fontSize: "10px",
  },
  dragRegion: {
    width: '100%',
    WebkitAppRegion: 'drag',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'left',
  },
  title: {
    transform: 'translate(-0px,-22px)',
    fontSize: '14px',
    margin: '20px 0',
  },
  closeButton: {
    marginRight: '10px',
    backgroundColor: '#ccc',
    color: 'black',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'absolute' as 'absolute',
    top: '5px',
    right: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default PopupSpeedMonitor;
