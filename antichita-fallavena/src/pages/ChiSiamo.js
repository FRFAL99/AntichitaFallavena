import React from 'react';
import './CSSpages/ChiSiamo.css';

const ChiSiamo = () => {
  return (
    <div className="page-content">
      <h2>Chi Siamo</h2>

      {/* Storia dell'azienda */}
      <section className="company-history">
        <h3>La nostra storia</h3>
        <p>
          La nostra azienda è nata nel 1995 con l'idea di offrire ai nostri clienti
          mobili di alta qualità, provenienti da diverse epoche storiche. Con il
          tempo, abbiamo costruito una reputazione per la nostra passione per l'antiquariato
          e per la cura nei dettagli.
        </p>
      </section>

      {/* Missione e valori */}
      <section className="mission-values">
        <h3>La nostra missione</h3>
        <p>
          La nostra missione è quella di preservare la bellezza e l'eleganza dei mobili antichi,
          portandoli nelle case moderne. Ci impegniamo a offrire un servizio personalizzato
          e di alta qualità, garantendo che ogni pezzo che vendiamo sia una testimonianza
          della nostra passione per l'antiquariato.
        </p>

        <h3>I nostri valori</h3>
        <ul>
          <li>Qualità: Solo i migliori pezzi selezionati con cura.</li>
          <li>Affidabilità: Ogni acquisto è garantito.</li>
          <li>Passione: La nostra passione per l'antiquariato ci spinge a migliorare ogni giorno.</li>
        </ul>
      </section>

      {/* Il nostro team */}
      <section className="our-team">
        <h3>Il nostro team</h3>
        <p>
          Siamo un gruppo di esperti nel settore dell'antiquariato, con anni di esperienza
          nella selezione, restauro e vendita di mobili d'epoca. Il nostro team è sempre pronto
          ad assisterti con consigli esperti e personalizzati.
        </p>
        <div className="team-members">
          <div className="team-member">
            <img src="team-member-1.jpg" alt="Nome del membro 1" />
            <h4>Nome Membro 1</h4>
            <p>Ruolo: Esperto di Restauro</p>
          </div>
          <div className="team-member">
            <img src="team-member-2.jpg" alt="Nome del membro 2" />
            <h4>Nome Membro 2</h4>
            <p>Ruolo: Responsabile Vendite</p>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section className="contact-info">
        <h3>Contattaci</h3>
        <p>
          Se desideri maggiori informazioni sui nostri prodotti o servizi, non esitare a
          contattarci!
        </p>
        <p>Email: <a href="mailto:info@antichitafallavena.com">info@antichitafallavena.com</a></p>
        <p>Telefono: +39 123 456 789</p>
      </section>
    </div>
  );
};

export default ChiSiamo;
