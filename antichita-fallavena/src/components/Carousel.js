import React, { useEffect, useState } from 'react';
import app from '../firebase-config';
import { getDatabase, ref, get } from 'firebase/database';

const Carousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);

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

  return (
    <header>
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
              <img src={item.img} className="d-block w-100" alt={`Immagine ${index + 1}`} />
              <div className="carousel-caption d-none d-md-block">
                <h5>{item.titolo}</h5>
                <p>{item.testo}</p>
                <a href="#" className="btn btn-primary">Scopri di più</a>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </header>
  );
};

export default Carousel;
