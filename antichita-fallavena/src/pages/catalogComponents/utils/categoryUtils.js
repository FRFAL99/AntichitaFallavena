// src/components/catalog/utils/categoryUtils.js

// Funzione per ottenere icona per categoria
export const getCategoryIcon = (category) => {
  // Icone per categorie comuni - usando Font Awesome
  switch(category?.toLowerCase()) {
    case 'oggetto': return 'fas fa-box-open';
    case 'mobile': return 'fas fa-couch';
    case 'ceramica': return 'fas fa-wine-glass-alt';
    case 'mobili': return 'fas fa-couch';
    case 'quadri': return 'fas fa-paint-brush';
    case 'ceramiche': return 'fas fa-wine-glass-alt';
    case 'statue': return 'fas fa-chess-knight';
    case 'orologi': return 'fas fa-clock';
    case 'gioielli': return 'fas fa-gem';
    case 'argenti': return 'fas fa-utensils';
    case 'libri': return 'fas fa-book';
    case 'mappe': return 'fas fa-map';
    case 'monete': return 'fas fa-coins';
    case 'tappeti': return 'fas fa-border-all';
    case 'vetro': return 'fas fa-wine-glass';
    default: return 'fas fa-tag';
  }
};

// Funzione per ottenere un'immagine di sfondo per categoria
export const getCategoryBackground = (category) => {
  // Mappa delle immagini di sfondo per categoria
  const backgrounds = {
    'oggetto': '/images/categories/oggetto-bg.png',
    'mobile': '/images/categories/mobile-bg.png',
    'ceramica': '/images/categories/ceramica-bg.png',
    'mobili': '/images/categories/mobili-bg.jpg',
    'quadri': '/images/categories/quadri-bg.jpg',
    'ceramiche': '/images/categories/ceramiche-bg.jpg',
    'statue': '/images/categories/statue-bg.jpg',
    'orologi': '/images/categories/orologi-bg.jpg',
    'gioielli': '/images/categories/gioielli-bg.jpg',
    'argenti': '/images/categories/argenti-bg.jpg',
    'libri': '/images/categories/libri-bg.jpg',
    'mappe': '/images/categories/mappe-bg.jpg',
    'monete': '/images/categories/monete-bg.jpg',
    'tappeti': '/images/categories/tappeti-bg.jpg',
    'vetro': '/images/categories/vetro-bg.jpg',
  };
  
  // Restituisci l'immagine per la categoria o un'immagine di default
  return backgrounds[category?.toLowerCase()] || `https://via.placeholder.com/500x300?text=${category}`;
};

// Funzione per ottenere un colore associato a ciascuna categoria
export const getCategoryColor = (category) => {
  const categoryColors = {
    'oggetto': '#8C7B65',    // Marrone chiaro
    'mobile': '#6C4F3D',     // Marrone scuro
    'ceramica': '#9BA17B',   // Verde oliva
    'mobili': '#8C7B65',     // Marrone chiaro
    'quadri': '#9F7E69',     // Terracotta
    'ceramiche': '#9BA17B',  // Verde oliva
    'statue': '#B89F82',     // Beige scuro
    'orologi': '#8A9A5B',    // Verde salvia
    'gioielli': '#D4AF37',   // Oro
    'argenti': '#C0C0C0',    // Argento
    'libri': '#A57C52',      // Cognac
    'mappe': '#7D9D9C',      // Verde azzurro
    'monete': '#CD9B1D',     // Oro antico
    'tappeti': '#B5651D',    // Marrone rossastro
    'vetro': '#88BDBC',      // Acquamarina
  };

  // Restituisci il colore per la categoria o un colore di default
  return categoryColors[category?.toLowerCase()] || '#403D39';
};