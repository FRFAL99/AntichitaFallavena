// src/components/catalog/utils/epochUtils.js

// Funzione per ottenere icona per epoca
export const getEpochIcon = (epoch) => {
  if (!epoch) return 'fas fa-history';
  
  // Convertiamo in lowercase per una corrispondenza case-insensitive
  switch(epoch.toLowerCase()) {
    case 'medioevo': return 'fas fa-chess-rook';
    case 'rinascimento': return 'fas fa-drafting-compass';
    case 'barocco': return 'fas fa-church';
    case 'rococò': 
    case 'rococo': return 'fas fa-feather-alt';
    case 'neoclassico': return 'fas fa-columns';
    case 'art nouveau': 
    case 'liberty': return 'fas fa-leaf';
    case 'art déco':
    case 'art deco': return 'fas fa-city';
    case 'moderno': return 'fas fa-square';
    case 'contemporaneo': return 'fas fa-cubes';
    case '800': 
    case 'ottocento': return 'fas fa-landmark';
    case '900': 
    case 'novecento': return 'fas fa-building';
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
    'medioevo': 'V-XV secolo',
    'rinascimento': 'XV-XVI secolo',
    'barocco': 'XVII secolo',
    'rococo': 'XVIII secolo',
    'rococò': 'XVIII secolo',
    'neoclassico': 'XVIII-XIX secolo',
    'art nouveau': '1890-1910',
    'liberty': '1890-1910',
    'art deco': '1920-1940',
    'art déco': '1920-1940',
    'moderno': '1940-1970',
    'contemporaneo': 'Post 1970',
    '800': 'XIX secolo',
    'ottocento': 'XIX secolo',
    '900': 'XX secolo',
    'novecento': 'XX secolo'
  };
  
  return epochDates[epoch.toLowerCase()] ? `${epoch} (${epochDates[epoch.toLowerCase()]})` : epoch;
};

// Funzione per ottenere un'immagine di sfondo per epoca
export const getEpochBackground = (epoch) => {
  if (!epoch) return 'https://via.placeholder.com/500x300?text=Epoca+sconosciuta';
  
  // Mappa delle immagini di sfondo per epoche
  const backgrounds = {
    'medioevo': '/images/epochs/medioevo-bg.jpg',
    'rinascimento': '/images/epochs/rinascimento-bg.jpg',
    'barocco': '/images/epochs/barocco-bg.jpg',
    'rococo': '/images/epochs/rococo-bg.jpg',
    'rococò': '/images/epochs/rococo-bg.jpg',
    'neoclassico': '/images/epochs/neoclassico-bg.jpg',
    'art nouveau': '/images/epochs/art-nouveau-bg.jpg',
    'liberty': '/images/epochs/art-nouveau-bg.jpg',
    'art deco': '/images/epochs/art-deco-bg.jpg',
    'art déco': '/images/epochs/art-deco-bg.jpg',
    'moderno': '/images/epochs/moderno-bg.jpg',
    'contemporaneo': '/images/epochs/contemporaneo-bg.jpg',
    '800': '/images/epochs/ottocento-bg.jpg',
    'ottocento': '/images/epochs/ottocento-bg.jpg',
    '900': '/images/epochs/novecento-bg.jpg',
    'novecento': '/images/epochs/novecento-bg.jpg'
  };
  
  // Restituisci l'immagine per l'epoca o un'immagine di default
  return backgrounds[epoch.toLowerCase()] || `https://via.placeholder.com/500x300?text=${epoch}`;
};

// Funzione per ottenere un colore associato a ciascuna epoca
export const getEpochColor = (epoch) => {
  if (!epoch) return '#403D39';
  
  const epochColors = {
    'medioevo': '#5D4037',        // Marrone scuro
    'rinascimento': '#4E342E',    // Marrone più scuro
    'barocco': '#8D6E63',         // Marrone chiaro
    'rococo': '#D7CCC8',          // Beige chiaro
    'rococò': '#D7CCC8',          // Beige chiaro
    'neoclassico': '#BCAAA4',     // Beige
    'art nouveau': '#558B2F',     // Verde
    'liberty': '#558B2F',         // Verde
    'art deco': '#00897B',        // Verde acqua
    'art déco': '#00897B',        // Verde acqua
    'moderno': '#455A64',         // Blu-grigio
    'contemporaneo': '#37474F',   // Blu-grigio scuro
    '800': '#78909C',             // Grigio azzurro
    'ottocento': '#78909C',       // Grigio azzurro
    '900': '#546E7A',             // Grigio blu
    'novecento': '#546E7A'        // Grigio blu
  };

  return epochColors[epoch.toLowerCase()] || '#403D39';
};