import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/doctor" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;