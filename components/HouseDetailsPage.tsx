import React, { useState } from 'react';
import { House, User, View } from '../types';
import MapView from './MapView';

interface HouseDetailsPageProps {
  house: House;
  navigate: (view: View) => void;
  owner?: User;
}

const HouseDetailsPage: React.FC<HouseDetailsPageProps> = ({ house, navigate, owner }) => {
  const [mainImage, setMainImage] = useState(house.imageUrls[0]);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('home')}
        className="mb-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <img src={mainImage || 'https://picsum.photos/800/600'} alt={house.title} className="w-full h-96 object-cover rounded-xl shadow-md mb-4"/>
          <div className="flex gap-2 flex-wrap">
            {house.imageUrls.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${house.title} thumbnail ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition ${mainImage === img ? 'ring-4 ring-primary' : 'hover:opacity-80'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{house.title}</h1>
          <p className="text-slate-600 mb-4">{house.address}</p>
          <p className="text-4xl font-extrabold text-primary mb-6">
            ₹{house.rent.toLocaleString()}<span className="text-lg font-medium text-slate-500">/month</span>
          </p>
          
          <div className="mb-6">
             <h2 className="text-xl font-bold text-slate-700 mb-3 border-b pb-2">Property Details</h2>
             <div className="space-y-2 text-slate-600">
                <p><strong>Type:</strong> {house.type}</p>
                <p><strong>Bedrooms:</strong> {house.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {house.bathrooms}</p>
                <p><strong>Area:</strong> {house.areaSqFt} sq. ft.</p>
             </div>
          </div>
          
          {owner && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-700 mb-3 border-b pb-2">Contact Owner</h2>
              <div className="space-y-3 text-slate-600">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  <span>{owner.name}</span>
                </div>
                {owner.phone && (
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.024 11.024 0 005.485 5.485l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    <span>{owner.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}


          <h2 className="text-xl font-bold text-slate-700 mb-2 border-b pb-2">Description</h2>
          <p className="text-slate-600 leading-relaxed mb-6">{house.description}</p>

          <button 
            onClick={() => setShowMap(true)}
            className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
          >
            Get Directions
          </button>
        </div>
      </div>
      
      {showMap && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Directions</h2>
          <MapView destination={house.coordinates} />
        </div>
      )}
    </div>
  );
};

export default HouseDetailsPage;