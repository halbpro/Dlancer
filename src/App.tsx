import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import './App.css';

import Dlancer from './abis/Dlancer.json'

import config from './config.json'

function App() {

  const[provider, setProvider] = useState<any>(null);
  const[dlancer, setDlancer] = useState<any>(null);
  
  const loadBlockchain = async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);

    const network = await prov.getNetwork();
    console.log(network);

    const dlancer = new ethers.Contract(config[31337].dlancar.address, (Dlancer as any), provider);
    setDlancer(dlancer);

    const owner = await dlancer.owner();
    console.log(owner);
  }
  
  useEffect(() => {
    loadBlockchain();
  }, []);
  

  return (
   <div>
    <h1>Hello</h1>
   </div>
  );
}

export default App;
