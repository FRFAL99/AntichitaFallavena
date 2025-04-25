import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import app from '../firebase-config';
import './CSScomponents/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Ottiene l'ID prodotto dall'URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const db = getDatabase(app);
        
        // Recupera tutti i prodotti dalla bacheca
        const bachecaRef = ref(db, 'Bacheca');
        const snapshot = await get(bachecaRef);
        
        if (snapshot.exists()) {
          let foundProduct = null;
          const allProducts = [];
          
          // Itera su tutti i nodi della bacheca
          snapshot.forEach((childSnapshot) => {
            const productData = childSnapshot.val();
            productData.id = childSnapshot.key; // Aggiungi l'ID (chiave Firebase)
            
            allProducts.push(productData);
            
            // Controlla se questo è il prodotto che stiamo cercando
            if (childSnapshot.key === id) {
              foundProduct = productData;
            }
          });
          
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Trova prodotti correlati (stessa categoria)
            if (foundProduct.Categoria) {
              const related = allProducts
                .filter(p => p.Categoria === foundProduct.Categoria && p.id !== id)
                .slice(0, 4); // Prendi solo i primi 4 prodotti correlati
              setRelatedProducts(related);
            }
          } else {
            setError('Prodotto non trovato');
          }
        } else {
          setError('Nessun dato trovato');
        }
      } catch (err) {
        console.error('Errore durante il recupero dei dati:', err);
        setError('Si è verificato un errore durante il caricamento del prodotto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Formatta il prezzo in Euro
  const formatPrice = (price) => {
    if (!price) return "Prezzo su richiesta";
    
    // Controlla se il prezzo è già una stringa formattata
    if (typeof price === 'string' && price.includes('€')) {
      return price;
    }
    
    // Altrimenti formatta il numero
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Errore</h2>
        <p>{error}</p>
        <Link to="/" className="btn-back">Torna alla Home</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {product && (
        <>
          <div className="product-detail-breadcrumb">
            <div className="container">
              <Link to="/">Home</Link> / 
              <Link to="/Catalogo"> Catalogo</Link> / 
              <span>{product.nome || 'Dettaglio Prodotto'}</span>
            </div>
          </div>
          
          <div className="container">
            <div className="product-detail-main">
              <div className="product-detail-gallery">
                <div className="product-main-image">
                  <img 
                    src={product.immagineUrl || 'https://via.placeholder.com/600x400?text=Immagine+non+disponibile'} 
                    alt={product.nome} 
                    className="main-image"
                  />
                  {product.Categoria && (
                    <span className="product-detail-category">{product.Categoria}</span>
                  )}
                </div>
                
                {/* Se in futuro avrai più immagini, potrai aggiungere una galleria qui */}
              </div>
              
              <div className="product-detail-info">
                <h1 className="product-detail-title">{product.nome}</h1>
                
                <div className="product-detail-price">
                  {formatPrice(product.prezzo)}
                </div>
                
                <div className="product-detail-description">
                  <h3>Descrizione</h3>
                  <p>{product.descrizione}</p>
                </div>
                
                {/* Dettagli aggiuntivi (se disponibili) */}
                <div className="product-detail-additional">
                  <h3>Dettagli prodotto</h3>
                  <ul>
                    {product.Categoria && <li><strong>Categoria:</strong> {product.Categoria}</li>}
                    {product.anno && <li><strong>Anno:</strong> {product.anno}</li>}
                    {product.condizione && <li><strong>Condizione:</strong> {product.condizione}</li>}
                    {product.dimensioni && <li><strong>Dimensioni:</strong> {product.dimensioni}</li>}
                    {product.origine && <li><strong>Origine:</strong> {product.origine}</li>}
                  </ul>
                </div>
                
                <div className="product-detail-contact">
                  <a href="tel:+391234567890" className="btn-contact">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    Contattaci per informazioni
                  </a>
                  
                  <a href={`mailto:info@antichitafallavena.it?subject=Richiesta%20informazioni%20su%20${encodeURIComponent(product.nome || 'prodotto')}`} className="btn-email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                    </svg>
                    Invia email
                  </a>
                </div>
              </div>
            </div>
            
            {/* Prodotti correlati */}
            {relatedProducts.length > 0 && (
              <div className="related-products">
                <h2>Prodotti correlati</h2>
                <div className="related-products-grid">
                  {relatedProducts.map((relatedProduct, index) => (
                    <div className="related-product-card" key={index}>
                      <Link to={`/prodotto/${relatedProduct.id}`}>
                        <div className="related-product-image">
                          <img 
                            src={relatedProduct.immagineUrl || 'https://via.placeholder.com/300x200?text=Immagine+non+disponibile'} 
                            alt={relatedProduct.nome} 
                          />
                        </div>
                        <div className="related-product-info">
                          <h3>{relatedProduct.nome}</h3>
                          <span className="related-product-price">{formatPrice(relatedProduct.prezzo)}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="back-to-catalog">
              <Link to="/Catalogo" className="btn-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                Torna al catalogo
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;