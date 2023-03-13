import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ethers } from 'ethers'
import './App.css';

import Dlancer from './abis/Dlancer.json'

import config from './config.json'
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Offers } from './pages/Offers/Offers';
import { Profile } from './pages/Profile';

function App() {

  const[provider, setProvider] = useState<any>(null);
  const[dlancer, setDlancer] = useState<any>(null);
  
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const loadBlockchain = async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);
    
    const dlnc = new ethers.Contract(config[31337].dlancar.address, Dlancer, provider);
    setDlancer(dlnc);
  }
  
  useEffect(() => {
      loadBlockchain();
  }, []);
  

  return (
   <div>
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/offers" element={<Offers />}/>
          <Route path="/profile" element={<Profile dlancer={dlancer}/>}/>
        </Routes>
    </Router>
   </div>
  );
}

export default App;
