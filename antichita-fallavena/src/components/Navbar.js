import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import flgIT from '../assets/images/flags/it.svg';
import flgUK from '../assets/images/flags/gb.svg';
import logo from '../assets/images/logo.svg';
import './CSScomponents/Navbar.css'; 

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Antichità Fallavena" style={{
            display: 'block',
            width: 'auto',
            height: '40px' 
          }}/>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Menu principale */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/ChiSiamo' ? 'active' : ''}`} 
                to="/ChiSiamo"
              >
                Chi Siamo
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/Eventi' ? 'active' : ''}`} 
                to="/Eventi"
              >
                Eventi
              </Link>
            </li>
            <li className={`nav-item dropdown ${location.pathname.includes('/Catalogo') ? 'active' : ''}`}>
              <a  
                className={`nav-link dropdown-toggle ${location.pathname.includes('/Catalogo') ? 'active' : ''}`}
                id="navbarDropdown"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false" >
                Catalogo
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link 
                    className={`dropdown-item ${location.pathname === '/Catalogo' ? 'active' : ''}`} 
                    to="/Catalogo">
                    Tutti i prodotti
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link 
                    className={`dropdown-item ${location.pathname === '/Catalogo/Offerte' ? 'active' : ''}`} 
                    to="/Catalogo/Offerte">
                    Offerte
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* Selettore lingua come elemento indipendente */}
        <div className="language-menu">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="languageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Lingua
              </a>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                <a className="dropdown-item" href="?lang=it">
                  <img src={flgIT} alt="Italiano" style={{ width: 20, height: "auto" }} /> Italiano
                </a>
                <a className="dropdown-item" href="?lang=en">
                  <img src={flgUK} alt="Inglese" style={{ width: 20, height: "auto" }} /> English
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;