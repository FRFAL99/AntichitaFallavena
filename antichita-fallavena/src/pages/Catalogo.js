import React, { useState } from 'react';
import Card from '../components/Card';  // Importa il componente Card

const Catalogo = () => {
  const products = [
    { id: 1, nome: "Antiquariato 1", descrizione: "Descrizione prodotto 1", prezzo: 100, foto: "/path-to-image1.jpg" },
    { id: 2, nome: "Antiquariato 2", descrizione: "Descrizione prodotto 2", prezzo: 150, foto: "/path-to-image2.jpg" },
    { id: 3, nome: "Antiquariato 3", descrizione: "Descrizione prodotto 3", prezzo: 200, foto: "/path-to-image3.jpg" },
    // altri prodotti...
  ];

  const [filter, setFilter] = useState('');

  const filteredProducts = products.filter(product => product.nome.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="page-content">
      <div className="container">
        {/* Filtro di ricerca */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Cerca un prodotto..." 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
            />
          </div>
        </div>

        {/* Sezione Catalogo */}
        <h2>Catalogo Prodotti</h2>
        <div className="row">
          {filteredProducts.map(product => (
            <Card
              key={product.id}
              nome={product.nome}
              foto={product.foto}
              descrizione={product.descrizione}
              prezzo={product.prezzo}
              link="#"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
