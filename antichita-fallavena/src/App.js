import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Componenti
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Bacheca from './components/Bacheca';
import MaintenanceBanner from './components/MaintenanceBanner'; 

// Pagine
import Catalogo from './pages/Catalogo';
import ChiSiamo from './pages/ChiSiamo';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function App() {
  return (
    <Router>
      <MaintenanceBanner />

      <div style={{ display: process.env.REACT_APP_MAINTENANCE_MODE === 'true' ? 'none' : 'block' }}>
        <Navbar /> 
        <Routes>
          <Route 
            path="/" 
            element={  
              <>
                <Carousel /> 
                <Bacheca /> 
              </>
            }
            key="home"  
          />
          <Route path="/Catalogo" element={<Catalogo />} />
          <Route path="/ChiSiamo" element={<ChiSiamo />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;
