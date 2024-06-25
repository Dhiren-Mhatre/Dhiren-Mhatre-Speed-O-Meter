import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SpeedMonitor from '../components/SpeedMonitor';

test('renders internet speed monitor', () => {
  render(<SpeedMonitor />);
  const headingElement = screen.getByText(/Internet Speed Monitor/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders download speed', () => {
  render(<SpeedMonitor />);
  const downloadElement = screen.getByText(/Download Speed:/i);
  expect(downloadElement).toBeInTheDocument();
});

test('renders upload speed', () => {
  render(<SpeedMonitor />);
  const uploadElement = screen.getByText(/Upload Speed:/i);
  expect(uploadElement).toBeInTheDocument();
});

test('renders latency', () => {
  render(<SpeedMonitor />);
  const latencyElement = screen.getByText(/Latency:/i);
  expect(latencyElement).toBeInTheDocument();
});

 