import React from 'react';
import annunci from '../data/Bacheca.json';
import Card from './Card';

const Bacheca = () => {   
    return (
<section className="bacheca-section py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="bacheca-title mb-4">In Evidenza:</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {annunci.map((annuncio, index) => (
            <Card
              key={index}
              nome={annuncio.nome}
              foto={annuncio.foto}
              descrizione={annuncio.descrizione}
              prezzo={annuncio.prezzo} 
              link="#"
            />
          ))}
          </div>
        </div>
      </section>
  );
};

export default Bacheca;