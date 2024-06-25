import React, { useState, useEffect, CSSProperties } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
interface Speed {
  download: number;
  upload: number;
}

const SpeedMonitor: React.FC = () => {
  const [speed, setSpeed] = useState<Speed>({ download: 0, upload: 0 });
  const [latency, setLatency] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [highestSpeed, setHighestSpeed] = useState<number>(0);
  const [lowestSpeed, setLowestSpeed] = useState<number>(Infinity);
  const [highestLatency, setHighestLatency] = useState<number>(0);
  const [lowestLatency, setLowestLatency] = useState<number>(Infinity);
  const [fileSizeMB, setFileSizeMB] = useState<string>('');
  const [downloadTime, setDownloadTime] = useState<number | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(10000);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    // Load data from local storage on component mount
    const savedData = localStorage.getItem('speedData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);

      // Calculate highest and lowest speeds and latencies from existing data
      calculateExtremes(parsedData);
    }
  }, []);

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
        const newSpeed = { download: parseFloat(speedKBps.toFixed(2)), upload: parseFloat((speedKBps / 2).toFixed(2)) };
        setSpeed(newSpeed);
        setLatency(duration * 1000); // Convert to milliseconds

        // Add new data point to the graph data
        const newDataPoint = { time: new Date().toLocaleTimeString(), ...newSpeed, latency: duration * 1000 };
        setData(prevData => {
          const updatedData = [...prevData, newDataPoint];
          localStorage.setItem('speedData', JSON.stringify(updatedData)); // Store updated data in local storage

          // Update highest and lowest speeds and latencies
          calculateExtremes(updatedData);
          return updatedData;
        });
      };
    };

    const interval = setInterval(measureSpeed, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const calculateExtremes = (data: any[]) => {
    let maxDownload = 0;
    let maxUpload = 0;
    let minDownload = Infinity;
    let minUpload = Infinity;
    let maxLatency = 0;
    let minLatency = Infinity;

    data.forEach((item) => {
      if (item.download > maxDownload) maxDownload = item.download;
      if (item.upload > maxUpload) maxUpload = item.upload;
      if (item.download < minDownload) minDownload = item.download;
      if (item.upload < minUpload) minUpload = item.upload;
      if (item.latency > maxLatency) maxLatency = item.latency;
      if (item.latency < minLatency) minLatency = item.latency;
    });

    setHighestSpeed(Math.max(maxDownload, maxUpload));
    setLowestSpeed(Math.min(minDownload, minUpload));
    setHighestLatency(maxLatency);
    setLowestLatency(minLatency);
  };

  const handleFileSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setFileSizeMB(value);
  };

  const calculateDownloadTime = () => {
    if (speed.download > 0 && fileSizeMB !== '') {
      const fileSizeInMB = parseFloat(fileSizeMB);
      if (!isNaN(fileSizeInMB)) {
        const fileSizeInKB = fileSizeInMB * 1024; // Convert MB to KB
        const downloadTimeInSeconds = fileSizeInKB / speed.download;
        const downloadTimeInMinutes = downloadTimeInSeconds / 60; // Convert to minutes
        setDownloadTime(downloadTimeInMinutes);
      } else {
        setDownloadTime(null);
      }
    } else {
      setDownloadTime(null);
    }
  };

  const handleDeleteData = () => {
    localStorage.removeItem('speedData');
    setData([]);
    setHighestSpeed(0);
    setLowestSpeed(Infinity);
    setHighestLatency(0);
    setLowestLatency(Infinity);
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  const handleDownloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${[
      ['Time', 'Download Speed (KBps)', 'Upload Speed (KBps)', 'Latency (ms)'],
      ...data.map(item => [item.time, item.download, item.upload, item.latency]),
    ]
      .map(e => e.join(','))
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'speed_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container as CSSProperties}>
      <h1 style={styles.title as CSSProperties}>Speed Monitor</h1>
      <div style={styles.detailsContainer as CSSProperties}>
        <div style={styles.details as CSSProperties}>
          <p>Download Speed</p>
          <p>{speed.download.toFixed(2)} KBps</p>
          <p>Highest: {highestSpeed.toFixed(2)} KBps</p>
          <p>Lowest: {lowestSpeed.toFixed(2)} KBps</p>
        </div>
        <div style={styles.details as CSSProperties}>
          <p>Upload Speed</p>
          <p>{speed.upload.toFixed(2)} KBps</p>
          <p>Highest: {highestSpeed.toFixed(2)} KBps</p>
          <p>Lowest: {lowestSpeed.toFixed(2)} KBps</p>
        </div>
        <div style={styles.details as CSSProperties}>
          <p>Latency</p>
          <p>{latency.toFixed(2)} ms</p>
          <p>Highest: {highestLatency.toFixed(2)} ms</p>
          <p>Lowest: {lowestLatency.toFixed(2)} ms</p>
        </div>
      </div>
      <div style={styles.calculator as CSSProperties}>
        <h2 style={styles.calculatorTitle as CSSProperties}>Download Time Calculator</h2>
        <div style={styles.inputContainer as CSSProperties}>
          <input
            type="text"
            placeholder="Enter file size (MB)"
            value={fileSizeMB}
            onChange={handleFileSizeChange}
            style={styles.input as CSSProperties}
          />
        </div>
        <button onClick={calculateDownloadTime} style={styles.calculateButton as CSSProperties}>Calculate</button>
        {downloadTime !== null && (
          <div style={styles.result as CSSProperties}>
            <p>Download Time: {downloadTime.toFixed(2)} minutes</p>
          </div>
        )}
      </div>
      <div style={styles.chartContainer as CSSProperties}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="download" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="upload" stroke="#82ca9d" />
            <Line type="monotone" dataKey="latency" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.intervalSelector as CSSProperties}>
        <label htmlFor="refreshInterval" style={styles.intervalLabel as CSSProperties}>Refresh Interval:</label>
        <select id="refreshInterval" value={refreshInterval} onChange={handleRefreshIntervalChange} style={styles.intervalSelect as CSSProperties}>
          <option style={styles.optionSelect as CSSProperties} value={5000}>5 seconds</option>
          <option style={styles.optionSelect as CSSProperties} value={10000}>10 seconds</option>
          <option style={styles.optionSelect as CSSProperties} value={30000}>30 seconds</option>
          <option style={styles.optionSelect as CSSProperties} value={60000}>1 minute</option>
        </select>
      </div>
      <button onClick={handleDownloadCSV} style={styles.downloadButton as CSSProperties}>Download CSV</button>
      <button onClick={handleDeleteData} style={styles.deleteButton as CSSProperties}>Delete Data</button>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: 'arial',
    width: '80%',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    // background: 'rgb(124,43,204)',
    background: 'radial-gradient(circle, rgba(124,43,204,1) 0%, rgba(226,209,221,1) 0%, rgba(237,170,170,1) 0%, rgba(208,135,160,1) 18%, rgba(124,30,131,1) 95%)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: 'white',
  },
  detailsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  details: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    padding: '10px',
    marginRight: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
  },
  calculator: {
    color: 'white',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
  },
  calculatorTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  calculateButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    marginBottom: '10px',
  },
  result: {
    fontSize: '18px',
    marginTop: '10px',
  },
  chartContainer: {
    marginTop: '20px',
  },
  intervalSelector: {
    marginTop: '20px',
  },
  intervalLabel: {
    fontSize: '16px',
    color: 'white',
  },
  intervalSelect: {
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginLeft: '10px',
  },
  downloadButton: {
    backgroundColor: '#008CBA',
    color: 'white',
    padding: '10px 20px',
    marginRight: '10px',
    textAlign: 'center',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1em',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  optionSelect: {
    color: 'black',
    fontSize: '16px',
    background: 'rgba(0, 0, 0, 0.2)',
  },
};

export default SpeedMonitor;
 
