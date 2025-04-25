import React, { useEffect, useState } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';
import './CSScomponents/Carousel.css'; 

const Carousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselData = async () => {
      const db = getDatabase(app);
      const caroselloRef = ref(db, 'Carosello');

      try {
        const snapshot = await get(caroselloRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const items = Object.values(data); // Trasforma in array
          setCarouselItems(items);
        } else {
          console.log("Nessun dato trovato nel carosello.");
        }
      } catch (error) {
        console.error("Errore durante il fetch dei dati:", error);
      }
    };

    fetchCarouselData();
  }, []);

  // Funzione per passare manualmente alla slide successiva
  const nextSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Funzione per passare manualmente alla slide precedente
  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Funzione per selezionare direttamente una slide
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Effetto per autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Cambia slide ogni 5 secondi

    return () => clearInterval(interval); // Pulizia all'unmount
  }, [carouselItems, activeIndex]);

  return (
    <header className="modern-carousel-container">
      <div className="modern-carousel">
        <div className="carousel-inner-container">
          {carouselItems.map((item, index) => (
            <div 
              className={`carousel-slide ${index === activeIndex ? "active" : ""}`} 
              key={index}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="carousel-content">
                <h2 className="slide-title">{item.titolo}</h2>
                <p className="slide-description">{item.testo}</p>
                <a href="#" className="btn-discover">Scopri di più</a>
              </div>
              <div className="overlay"></div>
            </div>
          ))}
        </div>

        {/* Frecce di navigazione */}
        <button className="carousel-arrow carousel-arrow-prev" onClick={prevSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="carousel-arrow carousel-arrow-next" onClick={nextSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Indicatori di slide */}
        <div className="carousel-indicators">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Carousel;