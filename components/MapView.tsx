import React from 'react';

interface MapViewProps {
  center?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ center, destination, zoom = 12 }) => {
  let mapSrc = '';
  
  if (destination) {
    mapSrc = `https://maps.google.com/maps?saddr=My+Location&daddr=${destination.lat},${destination.lng}&output=embed`;
  } else if (center) {
    mapSrc = `https://maps.google.com/maps?q=${center.lat},${center.lng}&hl=en&z=${zoom}&output=embed`;
  }

  if (!mapSrc) {
    return (
      <div className="h-96 md:h-[500px] w-full bg-slate-200 rounded-xl shadow-lg flex items-center justify-center">
        <p className="text-slate-500">Map not available.</p>
      </div>
    );
  }

  return (
    <div className="h-96 md:h-[500px] w-full bg-slate-200 rounded-xl shadow-lg overflow-hidden">
      <iframe
        title="House Locations"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapView;
