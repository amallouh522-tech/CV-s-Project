import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NFP from './pages/NFP';
import Verify from './pages/Verify';
import Index from './pages/Index';
import GithubCallback from './pages/GithubCallback';
import AddNewCv from './pages/AddNewCv';

import "./style.css";


function Logout() {
  const Navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    Navigate("/login");
  }, []);
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/addcv' element={<AddNewCv />} />
        <Route path="/github/callback" element={<GithubCallback />} />
        <Route path='/*' element={<NFP />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
