// src/components/catalog/utils/epochUtils.js

// Funzione per ottenere icona per epoca
export const getEpochIcon = (epoch) => {
    switch(epoch) {
      case 'Medioevo': return 'fas fa-chess-rook';
      case 'Rinascimento': return 'fas fa-drafting-compass';
      case 'Barocco': return 'fas fa-church';
      case 'Rococò': return 'fas fa-feather-alt';
      case 'Neoclassico': return 'fas fa-columns';
      case 'Art Nouveau': return 'fas fa-leaf';
      case 'Art Déco': return 'fas fa-city';
      case 'Moderno': return 'fas fa-square';
      case 'Contemporaneo': return 'fas fa-cubes';
      default: return 'fas fa-history';
    }
  };
  
  // Formatta l'epoca per la visualizzazione
  export const formatEpoch = (epoch) => {
    if (!epoch) return 'Epoca sconosciuta';
    
    // Se l'epoca include già info come secolo/anni, la manteniamo
    if (epoch.includes('secolo') || /\d{2,4}/.test(epoch)) {
      return epoch;
    }
    
    // Mapping per epoche comuni con date approssimative
    const epochDates = {
      'Medioevo': 'V-XV secolo',
      'Rinascimento': 'XV-XVI secolo',
      'Barocco': 'XVII secolo',
      'Rococò': 'XVIII secolo',
      'Neoclassico': 'XVIII-XIX secolo',
      'Art Nouveau': '1890-1910',
      'Art Déco': '1920-1940',
      'Moderno': '1940-1970',
      'Contemporaneo': 'Post 1970'
    };
    
    return epochDates[epoch] ? `${epoch} (${epochDates[epoch]})` : epoch;
  };