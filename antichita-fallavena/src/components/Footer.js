import React from 'react';

const Footer = () => {
  return (
    <footer className="py-5 bg-dark">
      <div className="container">
        <p className="m-0 text-center text-white">
          &copy; {new Date().getFullYear()} Antichità Fallavena. Tutti i diritti riservati.
        </p>
        <p className="m-0 text-center text-white">
          <a href="#!" className="text-white text-decoration-none">Privacy Policy</a> | 
          <a href="#!" className="text-white text-decoration-none"> Termini e Condizioni</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
