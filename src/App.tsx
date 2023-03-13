import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ethers } from 'ethers'
import './App.css';

import Dlancer from './abis/Dlancer.json'
import OfferBase from './abis/OfferBase.json'
import WorkerBase from './abis/WorkerBase.json'

import config from './config.json'
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Offers } from './pages/Offers/Offers';
import { Profile } from './pages/Profile';

function App() {

  const[provider, setProvider] = useState<any>(null);
  const[dlancerContract, setDlancerContract] = useState<any>(null);
  
  const[offerContract, setOfferContract] = useState<any>(null);
  const[workerContract, setWorkerContract] = useState<any>(null);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const loadBlockchain = async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);
    
    const dlancer = new ethers.Contract(config[31337].dlancar.address, Dlancer, provider);
    setDlancerContract(dlancer);

    const offer = new ethers.Contract(config[31337].dlancar.address, OfferBase, provider);
    setOfferContract(offer);

    const worker = new ethers.Contract(config[31337].dlancar.address, WorkerBase, provider);
    setWorkerContract(worker);
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
          <Route path="/profile" element={<Profile dlancerContract={dlancerContract}/>}/>
        </Routes>
    </Router>
   </div>
  );
}

export default App;
