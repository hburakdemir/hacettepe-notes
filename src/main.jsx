import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SavedPostsProvider } from './context/SavedPostContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SavedPostsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SavedPostsProvider>
    </AuthProvider>
  </React.StrictMode>
);
