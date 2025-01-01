import React from 'react';
import annunci from '../data/Bacheca.json';

const Bacheca = () => {   
    return (
<section className="bacheca-section py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="bacheca-title mb-4">In Evidenza:</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {annunci.map((annuncio, index) => (
              <div className="col mb-5" key={index}>
                <div className="card bacheca-card h-100">
                  <img className="card-img-top" src={annuncio.foto} alt={annuncio.nome} />
                  <div className="card-body p-4">
                    <div className="text-center">
                      <h5 className="fw-bolder">{annuncio.nome}</h5>
                      <p>{truncateText(annuncio.descrizione, 90)}</p>
                    </div>
                  </div>
                  <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center">
                      <a className="btn btn-outline-dark mt-auto" href="#">View options</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

export default Bacheca;