import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from '../firebase-config';
import { getDatabase, ref, push, set, update, remove, get } from 'firebase/database';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import './CSSpages/AdminEventi.css';

const AdminBacheca = () => {
  const [prodottiBacheca, setProdottiBacheca] = useState([]);
  const [prodottiCatalogo, setProdottiCatalogo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'manage', 'bacheca'
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    Categoria: '',
    anno: '',
    dimensioni: '',
    disponibilita: 'disponibile',
    materiali: '',
    // Rimosso il campo peso
    numeroPezzi: '',
    immagineUrl: '',
    immagini: []
  });
  // Aggiunto stato per il toggle del prezzo non specificato
  const [prezzoNonSpecificato, setPrezzoNonSpecificato] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { logout } = useGoogleAuth();
  const navigate = useNavigate();

  const db = getDatabase(app);

  useEffect(() => {
    fetchProdotti();
  }, []);

  // Imposta correttamente il prezzo non specificato quando si carica un prodotto esistente
  useEffect(() => {
    if (editingProduct && editingProduct.prezzoNonSpecificato) {
      setPrezzoNonSpecificato(true);
    } else {
      setPrezzoNonSpecificato(false);
    }
  }, [editingProduct]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const fetchProdotti = async () => {
    setLoading(true);
    try {
      const bachecaRef = ref(db, 'Bacheca');
      const catalogoRef = ref(db, 'Catalogo');
      
      const [bachecaSnapshot, catalogoSnapshot] = await Promise.all([
        get(bachecaRef),
        get(catalogoRef)
      ]);
      
      const bachecaData = [];
      const catalogoData = [];
      
      if (bachecaSnapshot.exists()) {
        bachecaSnapshot.forEach((childSnapshot) => {
          bachecaData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      if (catalogoSnapshot.exists()) {
        catalogoSnapshot.forEach((childSnapshot) => {
          catalogoData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      setProdottiBacheca(bachecaData);
      setProdottiCatalogo(catalogoData);
    } catch (error) {
      console.error("Errore nel recupero dei prodotti:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && formData.immagini.length < 5) {
      setFormData(prev => ({
        ...prev,
        immagini: [...prev.immagini, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    } else if (formData.immagini.length >= 5) {
      alert("Puoi aggiungere massimo 5 immagini aggiuntive");
    }
  };

  const handleRemoveImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      immagini: prev.immagini.filter((_, i) => i !== index)
    }));
  };

  // Gestisce il toggle del prezzo non specificato
  const handlePrezzoToggle = (e) => {
    const checked = e.target.checked;
    setPrezzoNonSpecificato(checked);
    
    // Se si attiva "prezzo non specificato", disabilita il campo prezzo
    if (checked) {
      setFormData(prev => ({
        ...prev,
        prezzo: '' // Svuota il campo prezzo
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crea un timestamp ISO per la data di aggiunta (formato compatibile con ordinamento)
      const dataAggiunta = new Date().toISOString();
      
      const productData = {
        nome: formData.nome,
        descrizione: formData.descrizione,
        prezzo: prezzoNonSpecificato ? '' : formData.prezzo, // Se prezzo non specificato, salva stringa vuota
        prezzoNonSpecificato: prezzoNonSpecificato, // Salva lo stato del toggle
        Categoria: formData.Categoria,
        anno: formData.anno,
        dimensioni: formData.dimensioni,
        disponibilita: formData.disponibilita,
        materiali: formData.materiali,
        // Rimosso il campo peso
        numeroPezzi: formData.numeroPezzi,
        immagineUrl: formData.immagineUrl,
        immagini: formData.immagini,
        updatedAt: Date.now(),
        // Aggiungi il campo dataAggiunta per la visualizzazione degli ultimi arrivi
        dataAggiunta: dataAggiunta
      };

      if (editingProduct) {
        // Aggiorna prodotto esistente
        const prodottoRef = ref(db, `Catalogo/${editingProduct.id}`);
        await update(prodottoRef, productData);
      } else {
        // Crea nuovo prodotto sempre nel catalogo
        const catalogoRef = ref(db, 'Catalogo');
        const newProductRef = push(catalogoRef);
        await set(newProductRef, {
          ...productData,
          createdAt: Date.now()
        });
      }

      // Reset form
      setFormData({
        nome: '',
        descrizione: '',
        prezzo: '',
        Categoria: '',
        anno: '',
        dimensioni: '',
        disponibilita: 'disponibile',
        materiali: '',
        // Rimosso il campo peso
        numeroPezzi: '',
        immagineUrl: '',
        immagini: []
      });
      setPrezzoNonSpecificato(false);
      setEditingProduct(null);
      
      await fetchProdotti();
      setActiveTab('manage');
    } catch (error) {
      console.error("Errore nel salvataggio del prodotto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prodotto) => {
    setEditingProduct(prodotto);
    setFormData({
      nome: prodotto.nome || '',
      descrizione: prodotto.descrizione || '',
      prezzo: prodotto.prezzo || '',
      Categoria: prodotto.Categoria || '',
      anno: prodotto.anno || '',
      dimensioni: prodotto.dimensioni || '',
      disponibilita: prodotto.disponibilita || 'disponibile',
      materiali: prodotto.materiali || '',
      // Rimosso il campo peso
      numeroPezzi: prodotto.numeroPezzi || '',
      immagineUrl: prodotto.immagineUrl || '',
      immagini: prodotto.immagini || []
    });
    
    // Imposta lo stato del checkbox "Prezzo non specificato"
    setPrezzoNonSpecificato(prodotto.prezzoNonSpecificato || false);
    
    setActiveTab('add');
  };

  const handleDelete = async (prodottoId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto? Verrà rimosso anche dalla bacheca se presente.")) {
      try {
        // Elimina dal catalogo
        const catalogoRef = ref(db, `Catalogo/${prodottoId}`);
        await remove(catalogoRef);
        
        // Trova e elimina dalla bacheca tutti i prodotti collegati
        const prodottiBachecaCollegati = prodottiBacheca.filter(item => item.catalogoId === prodottoId);
        
        // Elimina i prodotti collegati dalla bacheca
        for (const prodottoBacheca of prodottiBachecaCollegati) {
          const bachecaRef = ref(db, `Bacheca/${prodottoBacheca.id}`);
          await remove(bachecaRef);
        }
        
        await fetchProdotti();
      } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
      }
    }
  };

  const handleAddToBacheca = async (prodotto) => {
    try {
      const bachecaRef = ref(db, 'Bacheca');
      const newBachecaRef = push(bachecaRef);
      await set(newBachecaRef, {
        ...prodotto,
        createdAt: Date.now(),
        catalogoId: prodotto.id // Mantiene il riferimento all'originale nel catalogo
      });
      await fetchProdotti();
      alert("Prodotto aggiunto alla bacheca!");
    } catch (error) {
      console.error("Errore nell'aggiunta alla bacheca:", error);
    }
  };

  const handleRemoveFromBacheca = async (prodottoId) => {
    if (window.confirm("Sei sicuro di voler rimuovere questo prodotto dalla bacheca?")) {
      try {
        const prodottoRef = ref(db, `Bacheca/${prodottoId}`);
        await remove(prodottoRef);
        await fetchProdotti();
      } catch (error) {
        console.error("Errore nella rimozione dalla bacheca:", error);
      }
    }
  };

  // Formatta la data in formato leggibile
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Funzione per visualizzare il prezzo formattato o "Prezzo non specificato"
  const displayPrice = (prodotto) => {
    if (prodotto.prezzoNonSpecificato) {
      return "Prezzo non specificato";
    } else if (prodotto.prezzo) {
      return `€ ${prodotto.prezzo}`;
    } else {
      return "N/A";
    }
  };

  return (
    <div className="admin-eventi">
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/admin')} 
            style={{
              background: 'transparent',
              border: '2px solid #403D39',
              color: '#403D39',
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dashboard
          </button>
          <h1>Gestione Prodotti</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
      

      {/* Tabs per navigazione */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => setActiveTab('add')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'add' ? '#EB5E28' : '#f8f9fa',
            color: activeTab === 'add' ? 'white' : '#403D39',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Aggiungi Prodotto
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'manage' ? '#EB5E28' : '#f8f9fa',
            color: activeTab === 'manage' ? 'white' : '#403D39',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Gestisci Catalogo
        </button>
        <button 
          onClick={() => setActiveTab('bacheca')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'bacheca' ? '#EB5E28' : '#f8f9fa',
            color: activeTab === 'bacheca' ? 'white' : '#403D39',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Gestisci Bacheca
        </button>
      </div>
      
      {/* Form per aggiungere/modificare prodotti */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="evento-form">
          <h2>{editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h2>
          
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrizione *</label>
            <textarea
              name="descrizione"
              value={formData.descrizione}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Prezzo (€) {!prezzoNonSpecificato && '*'}</label>
              <input
                type="number"
                name="prezzo"
                value={formData.prezzo}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required={!prezzoNonSpecificato}
                disabled={prezzoNonSpecificato}
                style={{ opacity: prezzoNonSpecificato ? 0.5 : 1 }}
              />
              <div style={{ 
                marginTop: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <input
                  type="checkbox"
                  id="prezzo-non-specificato"
                  checked={prezzoNonSpecificato}
                  onChange={handlePrezzoToggle}
                  style={{ marginRight: '5px' }}
                />
                <label 
                  htmlFor="prezzo-non-specificato" 
                  style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 'normal', 
                    cursor: 'pointer',
                    margin: 0
                  }}
                >
                  Prezzo non specificato
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Categoria *</label>
              <select
                name="Categoria"
                value={formData.Categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleziona categoria</option>
                <option value="oggetto">Oggetto</option>
                <option value="mobile">Mobile</option>
                <option value="ceramica">Ceramica</option>
                <option value="dipinto">Dipinto</option>
                <option value="scultura">Scultura</option>
                <option value="gioiello">Gioiello</option>
                <option value="libro">Libro</option>
                <option value="tappeto">Tappeto</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Anno/Epoca</label>
              <input
                type="text"
                name="anno"
                value={formData.anno}
                onChange={handleInputChange}
                placeholder="es. 1800, XVIII secolo, etc."
              />
            </div>

            <div className="form-group">
              <label>Dimensioni</label>
              <input
                type="text"
                name="dimensioni"
                value={formData.dimensioni}
                onChange={handleInputChange}
                placeholder="es. 2 x 2 x 4 m"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Materiali</label>
              <input
                type="text"
                name="materiali"
                value={formData.materiali}
                onChange={handleInputChange}
                placeholder="es. oro, argento, legno"
              />
            </div>

            <div className="form-group">
              <label>Numero Pezzi</label>
              <input
                type="number"
                name="numeroPezzi"
                value={formData.numeroPezzi}
                onChange={handleInputChange}
                min="1"
                placeholder="es. 1, 2, 3..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Disponibilità</label>
              <select
                name="disponibilita"
                value={formData.disponibilita}
                onChange={handleInputChange}
              >
                <option value="disponibile">Disponibile</option>
                <option value="venduto">Venduto</option>
                <option value="riservato">Riservato</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>URL Immagine Principale *</label>
            <input
              type="url"
              name="immagineUrl"
              value={formData.immagineUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/..."
              required
            />
            {formData.immagineUrl && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData.immagineUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100px', borderRadius: '4px' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Immagini Aggiuntive (max 5)</label>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              padding: '1rem',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Inserisci URL immagine..."
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={handleAddImageUrl}
                  disabled={!newImageUrl.trim() || formData.immagini.length >= 5}
                  style={{ 
                    padding: '0.5rem 1rem',
                    backgroundColor: newImageUrl.trim() && formData.immagini.length < 5 ? '#EB5E28' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: newImageUrl.trim() && formData.immagini.length < 5 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Aggiungi
                </button>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '10px' }}>
                {formData.immagini.length}/5 immagini aggiunte
              </p>

              {formData.immagini.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: '15px' 
                }}>
                  {formData.immagini.map((url, index) => (
                    <div key={index} style={{ 
                      position: 'relative',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '8px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ 
                        position: 'relative',
                        paddingBottom: '100%',
                        overflow: 'hidden',
                        borderRadius: '4px'
                      }}>
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOGY5ZmEiLz48cGF0aCBkPSJNNTAgMjVMMzUgNDBINjVMNTAgMjVaTTUwIDc1TDY1IDYwSDM1TDUwIDc1Wk0yNSA1MEw0MCA2NVY0MEwyNSA1MFpNNzUgNTBMNjAgMzVWNjVMNzUgNTBaIiBmaWxsPSIjZGVlMmU2Ii8+PC9zdmc+';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          zIndex: 1
                        }}
                      >
                        ×
                      </button>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#403D39', 
                        marginTop: '8px', 
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        Immagine {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Salvataggio...' : editingProduct ? 'Aggiorna' : 'Aggiungi al Catalogo'}
            </button>
            {editingProduct && (
              <button type="button" onClick={() => {
                setEditingProduct(null);
                setPrezzoNonSpecificato(false);
                setFormData({
                  nome: '',
                  descrizione: '',
                  prezzo: '',
                  Categoria: '',
                  anno: '',
                  dimensioni: '',
                  disponibilita: 'disponibile',
                  materiali: '',
                  // Rimosso il campo peso
                  numeroPezzi: '',
                  immagineUrl: '',
                  immagini: []
                });
                setNewImageUrl('');
              }}>
                Annulla
              </button>
            )}
          </div>
        </form>
      )}

      {/* Gestione Catalogo */}
      {activeTab === 'manage' && (
        <div className="eventi-list">
          <h2>Catalogo Prodotti</h2>
          {loading ? (
            <p>Caricamento...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Immagine</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Prezzo</th>
                  <th>Disponibilità</th>
                  <th>Data Aggiunta</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {prodottiCatalogo.map(prodotto => (
                  <tr key={prodotto.id}>
                    <td>
                      {prodotto.immagineUrl && (
                        <img 
                          src={prodotto.immagineUrl} 
                          alt={prodotto.nome} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                    </td>
                    <td>{prodotto.nome}</td>
                    <td>{prodotto.Categoria}</td>
                    <td>{displayPrice(prodotto)}</td>
                    <td>{prodotto.disponibilita}</td>
                    <td>{formatDate(prodotto.dataAggiunta)}</td>
                    <td>
                      <button onClick={() => handleEdit(prodotto)}>Modifica</button>
                      <button onClick={() => handleDelete(prodotto.id)}>Elimina</button>
                      <button 
                        onClick={() => handleAddToBacheca(prodotto)}
                        style={{ backgroundColor: '#28a745' }}
                      >
                        + Bacheca
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Gestione Bacheca */}
      {activeTab === 'bacheca' && (
        <div className="eventi-list">
          <h2>Prodotti in Bacheca</h2>
          {loading ? (
            <p>Caricamento...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Immagine</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Prezzo</th>
                  <th>Data Aggiunta</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {prodottiBacheca.map(prodotto => (
                  <tr key={prodotto.id}>
                    <td>
                      {prodotto.immagineUrl && (
                        <img 
                          src={prodotto.immagineUrl} 
                          alt={prodotto.nome} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                    </td>
                    <td>{prodotto.nome}</td>
                    <td>{prodotto.Categoria}</td>
                    <td>{displayPrice(prodotto)}</td>
                    <td>{formatDate(prodotto.dataAggiunta)}</td>
                    <td>
                      <button 
                        onClick={() => handleRemoveFromBacheca(prodotto.id)}
                        style={{ backgroundColor: '#dc3545' }}
                      >
                        Rimuovi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBacheca;