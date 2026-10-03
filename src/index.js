import React from 'react';
import ReactDOM from 'react-dom/client';
import SavoriaRestaurant from './SavoriaRestaurant';
import './index.css'; // Pure Tailwind imports (@tailwind base; etc.)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SavoriaRestaurant />
  </React.StrictMode>
);