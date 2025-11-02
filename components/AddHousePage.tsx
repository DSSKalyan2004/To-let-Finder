import React, { useState } from 'react';
import { House, PropertyType, View, propertyTypes } from '../types';

interface AddHousePageProps {
  navigate: (view: View) => void;
  addHouse: (houseData: Omit<House, 'id' | 'ownerId' | 'imageUrls' | 'createdAt'>, images: FileList) => Promise<void>;
}

const AddHousePage: React.FC<AddHousePageProps> = ({ navigate, addHouse }) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaSqFt, setAreaSqFt] = useState('');
  const [type, setType] = useState<PropertyType>('Apartment');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 5) {
        setError('You can upload a maximum of 5 images.');
        e.target.value = ''; // Reset the input
        setImages(null);
      } else {
        setError('');
        setImages(e.target.files);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !rent || !description || !lat || !lng || !bedrooms || !bathrooms || !areaSqFt || !images || images.length === 0) {
      setError('Please fill all fields and upload at least one image.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const newHouseData = {
        title,
        address,
        description,
        rent: parseInt(rent, 10),
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        areaSqFt: parseInt(areaSqFt, 10),
        type,
      };
      
      await addHouse(newHouseData, images);
      navigate('home');
      
    } catch (err) {
      console.error(err);
      setError('Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <InputStyle />
      <button 
        onClick={() => navigate('home')}
        className="mb-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Cancel
      </button>
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Add a New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-600">Title</label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading} />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-slate-600">Property Images (Max 5)</label>
          <input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-primary hover:file:bg-orange-100" required disabled={loading}/>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-600">Address</label>
          <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rent" className="block text-sm font-medium text-slate-600">Monthly Rent (₹)</label>
              <input id="rent" type="number" value={rent} onChange={e => setRent(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-600">Property Type</label>
                <select id="type" value={type} onChange={e => setType(e.target.value as PropertyType)} className="mt-1 block w-full input-style" required disabled={loading}>
                    {propertyTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-600">Bedrooms</label>
              <input id="bedrooms" type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-600">Bathrooms</label>
              <input id="bathrooms" type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-slate-600">Area (sq. ft.)</label>
              <input id="area" type="number" value={areaSqFt} onChange={e => setAreaSqFt(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-slate-600">Latitude</label>
              <input id="lat" type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-slate-600">Longitude</label>
              <input id="lng" type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} className="mt-1 block w-full input-style" required disabled={loading}/>
            </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full input-style" required disabled={loading}/>
        </div>
        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
        <div className="pt-4">
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 disabled:bg-slate-400" disabled={loading}>
            {loading ? 'Submitting...' : 'List Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper component to inject custom styles for form inputs.
const InputStyle: React.FC = () => (
    <style>{`
        .input-style {
            padding: 0.5rem 0.75rem;
            background-color: white;
            border: 1px solid #cbd5e1; /* slate-300 */
            border-radius: 0.375rem; /* rounded-md */
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }
        select.input-style {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
        }
        .input-style:focus {
            outline: none;
            --tw-ring-color: #ea580c; /* primary */
            --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
            --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
            box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
            border-color: #ea580c; /* primary */
        }
        .input-style:disabled {
            background-color: #f1f5f9; /* slate-100 */
            cursor: not-allowed;
        }
    `}</style>
)

export default AddHousePage;