import React from 'react';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Bacheca from './components/Bacheca';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';


function App() {
  return (
    <>
            <Navbar />
            <Carousel />
            <Bacheca />
            <Footer />
    </>
  );
}

export default App;
