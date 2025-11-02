import React from 'react';
import { House, User, View } from '../types';

interface HouseCardProps {
  house: House;
  navigate: (view: View, house: House) => void;
  currentUser: User | null;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, navigate, currentUser }) => {
  const isOwner = currentUser && currentUser.uid === house.ownerId;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 relative">
      {isOwner && (
        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
          My Property
        </div>
      )}
      <img src={house.imageUrls[0] || 'https://picsum.photos/800/600'} alt={house.title} className="w-full h-56 object-cover"/>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{house.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{house.address}</p>
        
        <div className="flex text-sm text-slate-700 space-x-4 mb-4 border-t border-b py-2">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 8v8h14V8h-2.121l-4.384-4.384A2 2 0 008.12 3H3v5zm2-3h3.121L10 6.879V14H5V5z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{house.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v1h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1H4a1 1 0 01-1-1V7a1 1 0 011-1h1V5zm4-1a1 1 0 00-1 1v1h2V5a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{house.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{house.areaSqFt} sq.ft.</span>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <p className="text-2xl font-extrabold text-primary">
            ₹{house.rent.toLocaleString()}<span className="text-base font-medium text-slate-500">/month</span>
          </p>
          <button
            onClick={() => navigate('details', house)}
            className="bg-secondary hover:bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;