import React, { useEffect, useState } from 'react';
import './CSScomponents/MaintenanceBanner.css'; 

const MaintenanceBanner = () => {
  const [isInMaintenance, setIsInMaintenance] = useState(false);

  useEffect(() => {
    const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
    setIsInMaintenance(maintenanceMode);
  }, []);

  if (isInMaintenance) {
    return (
      <div className="maintenance-overlay">
        <div className="maintenance-banner">
          <h2>Il sito è in manutenzione. Torna più tardi!</h2>
        </div>
      </div>
    );
  }

  return null;
};

export default MaintenanceBanner;
