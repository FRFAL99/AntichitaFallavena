import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Componenti
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Bacheca from './components/Bacheca';

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
    <Navbar /> 
    
    <Routes>
        <Route 
          path="/" 
          element={  // Home
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
  </Router>
  );
}

export default App;
