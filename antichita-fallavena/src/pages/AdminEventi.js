import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from '../firebase-config';
import { getDatabase, ref, push, set, update, remove, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import './CSSpages/AdminEventi.css';

const AdminEventi = () => {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    titolo: '',
    dataInizio: '',
    dataFine: '',
    luogo: '',
    status: 'pubblicato'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { logout } = useGoogleAuth();
  const navigate = useNavigate();

  const db = getDatabase(app);
  const storage = getStorage(app);

  useEffect(() => {
    fetchEventi();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const fetchEventi = async () => {
    setLoading(true);
    try {
      const dbRef = ref(db, 'eventi');
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const eventiData = [];
        snapshot.forEach((childSnapshot) => {
          eventiData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setEventi(eventiData);
      } else {
        setEventi([]);
      }
    } catch (error) {
      console.error("Errore nel recupero degli eventi:", error);
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

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    const uploadPromises = imageFiles.map(async (file, index) => {
      const storageReference = storageRef(storage, `eventi/${Date.now()}_${index}_${file.name}`);
      const snapshot = await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });

    try {
      setUploadProgress(30);
      const imageUrls = await Promise.all(uploadPromises);
      setUploadProgress(100);
      return imageUrls;
    } catch (error) {
      console.error("Errore nell'upload delle immagini:", error);
      setUploadProgress(0);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      // Converti le date in timestamp
      const dataInizioTimestamp = new Date(formData.dataInizio).getTime();
      const dataFineTimestamp = new Date(formData.dataFine).getTime();
      
      // Upload immagini se presenti
      const imageUrls = await uploadImages();

      const eventData = {
        titolo: formData.titolo,
        dataInizioTimestamp,
        dataFineTimestamp,
        luogo: formData.luogo,
        status: formData.status,
        imageUrls: imageUrls,
        updatedAt: Date.now()
      };

      if (editingEvent) {
        // Aggiorna evento esistente
        const eventoRef = ref(db, `eventi/${editingEvent.id}`);
        await update(eventoRef, eventData);
      } else {
        // Crea nuovo evento
        const eventiRef = ref(db, 'eventi');
        const newEventRef = push(eventiRef);
        await set(newEventRef, {
          ...eventData,
          createdAt: Date.now()
        });
      }

      // Reset form
      setFormData({
        titolo: '',
        dataInizio: '',
        dataFine: '',
        luogo: '',
        status: 'pubblicato'
      });
      setImageFiles([]);
      setEditingEvent(null);
      setUploadProgress(0);
      
      // Ricarica eventi
      await fetchEventi();
    } catch (error) {
      console.error("Errore nel salvataggio dell'evento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (evento) => {
    setEditingEvent(evento);
    setFormData({
      titolo: evento.titolo,
      dataInizio: new Date(evento.dataInizioTimestamp).toISOString().split('T')[0],
      dataFine: new Date(evento.dataFineTimestamp).toISOString().split('T')[0],
      luogo: evento.luogo,
      status: evento.status || 'pubblicato'
    });
  };

  const handleDelete = async (eventoId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
      try {
        const eventoRef = ref(db, `eventi/${eventoId}`);
        await remove(eventoRef);
        await fetchEventi();
      } catch (error) {
        console.error("Errore nell'eliminazione dell'evento:", error);
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="admin-eventi">
      <div className="admin-header">
        <h1>Gestione Eventi</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
      
      {/* Form per aggiungere/modificare eventi */}
      <form onSubmit={handleSubmit} className="evento-form">
        <h2>{editingEvent ? 'Modifica Evento' : 'Nuovo Evento'}</h2>
        
        <div className="form-group">
          <label>Titolo</label>
          <input
            type="text"
            name="titolo"
            value={formData.titolo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data Inizio</label>
            <input
              type="date"
              name="dataInizio"
              value={formData.dataInizio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data Fine</label>
            <input
              type="date"
              name="dataFine"
              value={formData.dataFine}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Luogo</label>
          <input
            type="text"
            name="luogo"
            value={formData.luogo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Immagini (puoi selezionare più file)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {imageFiles.length > 0 && (
            <p className="selected-files">
              {imageFiles.length} immagini selezionate
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pubblicato">Pubblicato</option>
            <option value="bozza">Bozza</option>
            <option value="concluso">Concluso</option>
          </select>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvataggio...' : editingEvent ? 'Aggiorna' : 'Crea Evento'}
          </button>
          {editingEvent && (
            <button type="button" onClick={() => {
              setEditingEvent(null);
              setFormData({
                titolo: '',
                dataInizio: '',
                dataFine: '',
                luogo: '',
                status: 'pubblicato'
              });
              setImageFiles([]);
            }}>
              Annulla
            </button>
          )}
        </div>
      </form>

      {/* Lista degli eventi */}
      <div className="eventi-list">
        <h2>Eventi Esistenti</h2>
        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Periodo</th>
                <th>Luogo</th>
                <th>Status</th>
                <th>Immagini</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {eventi.map(evento => (
                <tr key={evento.id}>
                  <td>{evento.titolo}</td>
                  <td>
                    {formatDate(evento.dataInizioTimestamp)} - {formatDate(evento.dataFineTimestamp)}
                  </td>
                  <td>{evento.luogo}</td>
                  <td>{evento.status}</td>
                  <td>{evento.imageUrls ? evento.imageUrls.length : 0}</td>
                  <td>
                    <button onClick={() => handleEdit(evento)}>Modifica</button>
                    <button onClick={() => handleDelete(evento.id)}>Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminEventi;