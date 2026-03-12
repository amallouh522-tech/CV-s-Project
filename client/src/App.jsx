import React , {  } from 'react';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NFP from './pages/NFP';
import Verify from './pages/Verify';

import "./style.css";
import Index from './pages/Index';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/*' element={<NFP/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
