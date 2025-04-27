import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import app from '../firebase-config';
import './CSScomponents/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Numero massimo di immagini da mostrare
  const MAX_IMAGES = 6;
  // Numero massimo di immagini per la visualizzazione in fila
  const MAX_THUMBNAILS_PER_ROW = 4;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const db = getDatabase(app);
        
        const bachecaRef = ref(db, 'Bacheca');
        const snapshot = await get(bachecaRef);
        
        if (snapshot.exists()) {
          let foundProduct = null;
          const allProducts = [];
          
          snapshot.forEach((childSnapshot) => {
            const productData = childSnapshot.val();
            productData.id = childSnapshot.key;
            
            allProducts.push(productData);
            
            if (childSnapshot.key === id) {
              foundProduct = productData;
            }
          });
          
          if (foundProduct) {
            setProduct(foundProduct);
            
            if (foundProduct.Categoria) {
              const related = allProducts
                .filter(p => p.Categoria === foundProduct.Categoria && p.id !== id)
                .slice(0, 4);
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

  // Ottieni tutte le immagini del prodotto con limite
  const getProductImages = () => {
    if (!product) return [];
    
    let images = [];
    
    // Se hai un array di immagini
    if (product.immagini && Array.isArray(product.immagini)) {
      images = product.immagini.slice(0, MAX_IMAGES); // Limita al numero massimo
    }
    // Se hai un oggetto di immagini
    else if (product.immagini && typeof product.immagini === 'object') {
      images = Object.values(product.immagini)
        .filter(Boolean)
        .slice(0, MAX_IMAGES); // Limita al numero massimo
    }
    // Fallback al campo singolo 'immagineUrl'
    else if (product.immagineUrl) {
      images = [product.immagineUrl];
    }
    
    // Se non ci sono immagini, usa un placeholder
    if (images.length === 0) {
      images = ['https://via.placeholder.com/600x400?text=Immagine+non+disponibile'];
    }
    
    return images;
  };

  const productImages = getProductImages();
  const hasMoreImages = product?.immagini?.length > MAX_IMAGES;

  const formatPrice = (price) => {
    if (!price) return "Prezzo su richiesta";
    
    if (typeof price === 'string' && price.includes('€')) {
      return price;
    }
    
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nome,
        text: `Dai un'occhiata a questo: ${product.nome}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiato negli appunti!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Qui puoi aggiungere la logica per salvare nei preferiti
  };

  // Gestione navigazione immagini con frecce da tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && selectedImage > 0) {
        setSelectedImage(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && selectedImage < productImages.length - 1) {
        setSelectedImage(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, productImages.length]);

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
                    src={productImages[selectedImage]} 
                    alt={product.nome} 
                    className={`main-image ${isZoomed ? 'zoomed' : ''}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  {product.Categoria && (
                    <span className="product-detail-category">{product.Categoria}</span>
                  )}
                  
                  <button 
                    className="zoom-button" 
                    onClick={() => setIsZoomed(!isZoomed)}
                    aria-label={isZoomed ? "Riduci zoom" : "Ingrandisci"}
                  >
                    {isZoomed ? "−" : "+"}
                  </button>
                  
                  {/* Frecce per navigare tra le immagini */}
                  {productImages.length > 1 && (
                    <>
                      {selectedImage > 0 && (
                        <button 
                          className="gallery-nav-button prev"
                          onClick={() => setSelectedImage(prev => prev - 1)}
                          aria-label="Immagine precedente"
                        >
                          ‹
                        </button>
                      )}
                      {selectedImage < productImages.length - 1 && (
                        <button 
                          className="gallery-nav-button next"
                          onClick={() => setSelectedImage(prev => prev + 1)}
                          aria-label="Immagine successiva"
                        >
                          ›
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {/* Thumbnails - Mostra solo se ci sono più immagini */}
                {productImages.length > 1 && (
                  <div className="product-thumbnails">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                        aria-label={`Vista ${index + 1}`}
                      >
                        <img src={img} alt={`Vista ${index + 1}`} />
                      </button>
                    ))}
                    {hasMoreImages && (
                      <div className="more-images-indicator">
                        +{product.immagini.length - MAX_IMAGES} altre
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="product-detail-info">
                <div className="product-detail-header">
                  <h1 className="product-detail-title">{product.nome}</h1>
                  <div className="product-detail-actions">
                    {/* <button 
                      className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                      onClick={toggleFavorite}
                      aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button> */}
                    <button 
                      className="btn-share"
                      onClick={handleShare}
                      aria-label="Condividi"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="product-detail-price">
                  {formatPrice(product.prezzo)}
                </div>
                
                <div className="product-detail-description">
                  <h3>Descrizione</h3>
                  <p>{product.descrizione}</p>
                </div>
                
                <div className="product-detail-specs">
                  <h3>Dettagli prodotto</h3>
                  <div className="specs-grid">
                    {product.Categoria && (
                      <div className="spec-item">
                        <span className="spec-label">Categoria</span>
                        <span className="spec-value">{product.Categoria}</span>
                      </div>
                    )}
                    {product.anno && (
                      <div className="spec-item">
                        <span className="spec-label">Anno/Epoca</span>
                        <span className="spec-value">{product.anno}</span>
                      </div>
                    )}
                    {product.condizione && (
                      <div className="spec-item">
                        <span className="spec-label">Condizione</span>
                        <span className="spec-value">{product.condizione}</span>
                      </div>
                    )}
                    {product.dimensioni && (
                      <div className="spec-item">
                        <span className="spec-label">Dimensioni</span>
                        <span className="spec-value">{product.dimensioni}</span>
                      </div>
                    )}
                    {product.materiali && (
                      <div className="spec-item">
                        <span className="spec-label">Materiali</span>
                        <span className="spec-value">{product.materiali}</span>
                      </div>
                    )}
                    {product.origine && (
                      <div className="spec-item">
                        <span className="spec-label">Origine</span>
                        <span className="spec-value">{product.origine}</span>
                      </div>
                    )}
                    {product.codice && (
                      <div className="spec-item">
                        <span className="spec-label">Codice articolo</span>
                        <span className="spec-value">{product.codice}</span>
                      </div>
                    )}
                    {product.numeroPezzi && (
                      <div className="spec-item">
                        <span className="spec-label">Numero pezzi</span>
                        <span className="spec-value">{product.numeroPezzi}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Garanzie e Servizi */}
                {/* <div className="product-features">
                  <div className="feature-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Garanzia di autenticità</span>
                  </div>
                  <div className="feature-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <span>Spedizione assicurata</span>
                  </div>
                  <div className="feature-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Politica di reso</span>
                  </div>
                </div> */}
                
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
                <h2>Potrebbero interessarti</h2>
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