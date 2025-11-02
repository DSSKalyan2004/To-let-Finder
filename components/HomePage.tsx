import React, { useState, useMemo } from 'react';
import { House, User, UserType, View } from '../types';
import HouseCard from './HouseCard';

interface HomePageProps {
  houses: House[];
  navigate: (view: View, house?: House) => void;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ houses, navigate, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const welcomeMessage = currentUser 
    ? `Welcome back, ${currentUser.name}!` 
    : 'Find Your Next Home';

  const filteredHouses = useMemo(() => {
    if (!searchTerm.trim()) {
      return houses;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return houses.filter(house => 
      house.title.toLowerCase().includes(lowercasedFilter) ||
      house.address.toLowerCase().includes(lowercasedFilter)
    );
  }, [houses, searchTerm]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{welcomeMessage}</h1>
        <p className="mt-2 text-lg text-slate-500 max-w-2xl mx-auto">Browse through our curated list of properties available for rent.</p>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by area, address, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-full shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary"
            aria-label="Search for a property"
          />
        </div>
      </div>

      {filteredHouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredHouses.map(house => (
            <HouseCard key={house.id} house={house} navigate={navigate} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Properties Found</h2>
          <p className="text-slate-500">
            {searchTerm 
              ? `Your search for "${searchTerm}" did not match any properties.`
              : (currentUser?.type === UserType.Owner
                  ? "You haven't listed any properties yet. Click 'Add House' to get started."
                  : "There are currently no properties available. Please check back later."
                )
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;