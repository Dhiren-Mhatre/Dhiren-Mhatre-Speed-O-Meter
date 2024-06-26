# Speed Monitor Application

Speed Monitor is a web-based tool for monitoring internet speed metrics such as download speed, upload speed, and latency. It includes a popup mode for quick access from any location on your device.

## Features

- **Real-time Monitoring:** Continuously measures and displays current download speed, upload speed, and latency.
- - **Popup Mode:** Includes a lightweight popup mode using Electron, accessible from anywhere on your device
- **Historical Data:** Stores and visualizes historical speed and latency data using a line chart.
- **Download Time Calculator:** Calculates estimated download time based on user-provided file size and current download speed.
- **Data Export:** Allows exporting of monitored data as CSV for further analysis.
- **Customizable Refresh Interval:** Users can adjust the refresh interval for real-time data updates.
 

## Technologies Used

- **Next.js:** Framework for building server-rendered React applications with enhanced features such as routing and optimized performance.
- **Recharts:** Library for creating responsive and interactive charts in React applications.
- **Electron:** Used to create a cross-platform desktop application for the popup mode, enabling usage from any location.
- **LocalStorage:** Utilized for storing historical data within the browser.
- 
## Use Cases

- **Monitoring Home Internet:** Users can monitor their home internet speeds and latencies over time to track performance.
- **Network Troubleshooting:** Useful for diagnosing network issues by observing speed fluctuations and latency spikes.
- **Bandwidth Testing:** Provides a tool for testing bandwidth capabilities and evaluating service provider performance.
- **Educational Purposes:** Can be used in educational settings to demonstrate concepts like real-time data monitoring and charting.

## Installation and Usage

1. Clone the repository.
2. In one terminal, navigate to the project directory and run `npm run dev` to start the Next.js server for the main interface.
3. Open a new terminal and run `npm start` to start the Electron popup mode.
4. Open `http://localhost:3000` in your web browser to access the main application interface.
5. Adjust the refresh interval and enter a file size to calculate download time.
6. Explore the historical data chart and export data as CSV for further analysis.

## Development Notes

- Ensure stable internet connectivity for accurate speed and latency measurements.
- Adjust the refresh interval based on your preference and system capabilities.
- The popup mode uses Electron to provide a lightweight desktop experience, accessible from any location on your device.

Feel free to contribute to the project by submitting issues or pull requests on GitHub.
