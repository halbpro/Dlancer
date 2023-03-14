import { createContext, useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ethers } from 'ethers'
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Offers } from './pages/Offers/Offers';
import { Profile } from './pages/Profile/Profile';
import './App.css';

import Dlancer from './abis/Dlancer.json'

import config from './config.json'

export const AppContext = createContext<any>(null);

function App() {
  const[provider, setProvider] = useState<any>(null);
  const[dlancer, setDlancer] = useState<any>(null);
  const[signedInUser, setSignedInUser] = useState<string|null>(null);
  
  const loadBlockchain = async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);
    
    const dlnc = new ethers.Contract(config[31337].dlancar.address, Dlancer, prov);
    setDlancer(dlnc);
    
    const [user] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setSignedInUser(user);
    
    window.ethereum.on('accountsChanged', function ([account] : string[]) {
      setSignedInUser(account);
    })
  }  
  
  useEffect(() => {
      loadBlockchain();
  }, []);    
  
  return (
   <div>
    <AppContext.Provider value={{dlancer, provider, signedInUser}}>
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/offers" element={<Offers />}/>
            <Route path="/profile" element={<Profile />}/>
          </Routes>
      </Router>
    </AppContext.Provider>
   </div>
  );
}

export default App;
