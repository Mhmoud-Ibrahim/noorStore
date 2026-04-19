

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';

// استيراد التنسيقات
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </HelmetProvider>
  </React.StrictMode>,
)

