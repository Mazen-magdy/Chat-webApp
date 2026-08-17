import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { createClient } from '@supabase/supabase-js'
import Start from './pages/start';
import Dashboard from './pages/Dashboard';
import Enter from './pages/Enter';
import './theme.css';
import {supabaseClient} from './contexts';


const root = ReactDOM.createRoot(document.getElementById('root'));


const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
)


root.render(
  <React.StrictMode>
    <supabaseClient.Provider value = {supabase}>
      <BrowserRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/enter" replace />} />
        <Route path="/start" element={<Start />} />
        <Route path="/enter" element={<Enter />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
      </BrowserRouter>
    </supabaseClient.Provider>
  </React.StrictMode>
);