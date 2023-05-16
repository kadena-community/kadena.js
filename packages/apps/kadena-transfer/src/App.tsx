import React from 'react';
import './App.css';
import Home from './pages/home/home';
import CheckBalance from './pages/check-balance/check-balance';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/check-balance" element={<CheckBalance />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
