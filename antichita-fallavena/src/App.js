import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';
import GoogleProtectedRoute from './components/GoogleProtectedRoute';

// Componenti
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Bacheca from './components/Bacheca';
import MaintenanceBanner from './components/MaintenanceBanner'; 
import ProductDetail from './components/ProductDetail';

// Pagine
import Catalogo from './pages/Catalogo';
import ChiSiamo from './pages/ChiSiamo';
import Eventi from './pages/Eventi';
import AdminEventi from './pages/AdminEventi';
import AdminProdotti from './pages/AdminProdotti';
import AdminDashboard from './pages/AdminDashboard'; // NUOVO IMPORT

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function App() {
  return (
    <GoogleAuthProvider>
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
            <Route path="/Eventi" element={<Eventi />} />
            
            <Route 
              path="/admin" 
              element={
                <GoogleProtectedRoute>
                  <AdminDashboard />
                </GoogleProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/eventi" 
              element={
                <GoogleProtectedRoute>
                  <AdminEventi />
                </GoogleProtectedRoute>
              } 
            />
            <Route 
              path="/admin/prodotti" 
              element={
                <GoogleProtectedRoute>
                  <AdminProdotti />
                </GoogleProtectedRoute>
              } 
            />
            <Route path="/prodotto/:id" element={<ProductDetail />} />
          </Routes>
          <Footer /> 
        </div>
      </Router>
    </GoogleAuthProvider>
  );
}

export default App;