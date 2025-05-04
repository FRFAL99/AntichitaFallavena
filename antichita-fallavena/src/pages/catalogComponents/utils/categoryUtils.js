// src/components/catalog/utils/categoryUtils.js

// Funzione per ottenere icona per categoria
export const getCategoryIcon = (category) => {
    // Icone per categorie comuni - usando Font Awesome
    switch(category) {
      case 'Mobili': return 'fas fa-couch';
      case 'Quadri': return 'fas fa-paint-brush';
      case 'Ceramiche': return 'fas fa-wine-glass-alt';
      case 'Statue': return 'fas fa-chess-knight';
      case 'Orologi': return 'fas fa-clock';
      case 'Gioielli': return 'fas fa-gem';
      case 'Argenti': return 'fas fa-utensils';
      case 'Libri': return 'fas fa-book';
      case 'Mappe': return 'fas fa-map';
      case 'Monete': return 'fas fa-coins';
      case 'Tappeti': return 'fas fa-border-all';
      case 'Vetro': return 'fas fa-wine-glass';
      default: return 'fas fa-tag';
    }
  };
  
  // Funzione per ottenere un'immagine di sfondo per categoria
  export const getCategoryBackground = (category) => {
    // Esempi di immagini di sfondo per categoria (sostituisci con URL reali)
    const backgrounds = {
      'Mobili': 'https://example.com/images/furniture-bg.jpg',
      'Quadri': 'https://example.com/images/paintings-bg.jpg',
      // ... altre categorie
    };
    
    return backgrounds[category] || 'https://example.com/images/default-bg.jpg';
  };