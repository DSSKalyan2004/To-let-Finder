import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { House, User, UserType, View } from './types';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import HouseDetailsPage from './components/HouseDetailsPage';
import AddHousePage from './components/AddHousePage';
import ProfilePage from './components/ProfilePage';
import { MOCK_HOUSES, MOCK_USERS } from './constants';
import { app } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>(MOCK_HOUSES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('tolet-finder-user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('tolet-finder-user');
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const userToStore = { ...user };
      delete userToStore.password; // Don't store password
      setCurrentUser(userToStore);
      localStorage.setItem('tolet-finder-user', JSON.stringify(userToStore));
      setView('home');
    } else {
      throw new Error('Invalid email or password.');
    }
  }, [users]);

 const handleRegister = async (name, email, password) => {
  console.log("in register");
  console.log(email);
  
  
  const auth = getAuth(app);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  console.log(firebaseUser);
  
}
 
  const handleLogout = useCallback(async () => {
    setCurrentUser(null);
    localStorage.removeItem('tolet-finder-user');
    setView('home');
  }, []);

  const handleChangePassword = useCallback(async (currentPassword, newPassword) => {
    if (!currentUser) throw new Error("No user is signed in.");
    
    const userInDb = users.find(u => u.uid === currentUser.uid);
    if (!userInDb || userInDb.password !== currentPassword) {
      throw new Error("Incorrect current password.");
    }

    setUsers(prevUsers => prevUsers.map(u => 
      u.uid === currentUser.uid ? { ...u, password: newPassword } : u
    ));

  }, [currentUser, users]);

  const handleAddHouse = useCallback(async (newHouseData: Omit<House, 'id' | 'ownerId' | 'imageUrls' | 'createdAt'>, images: FileList) => {
    if (!currentUser) throw new Error("User not authenticated");
    
    const imageUrls = Array.from(images).map(file => URL.createObjectURL(file));

    const newHouse: House = {
      id: `house_${Date.now()}`,
      ...newHouseData,
      ownerId: currentUser.uid,
      imageUrls,
      createdAt: new Date().toISOString(),
    };
    setHouses(prev => [newHouse, ...prev]);

  }, [currentUser]);

  const navigate = useCallback((newView: View, house?: House) => {
    if (newView === 'details' && house) {
      setSelectedHouse(house);
    } else {
      setSelectedHouse(null);
    }
    setView(newView);
  }, []);

  const authContextValue = useMemo(() => ({
    currentUser,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    changePassword: handleChangePassword,
  }), [currentUser, loading, handleLogin, handleRegister, handleLogout, handleChangePassword]);
  
  const displayedHouses = houses; // All users see all houses

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
           <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-slate-500">Loading Application...</p>
        </div>
      );
    }
    switch (view) {
      case 'login':
        return <LoginPage />;
      case 'details':
        if (selectedHouse) {
          const owner = users.find(u => u.uid === selectedHouse.ownerId);
          return <HouseDetailsPage house={selectedHouse} navigate={navigate} owner={owner} />;
        }
        return <HomePage houses={displayedHouses} navigate={navigate} currentUser={currentUser} />;
      case 'add-house':
        return currentUser?.type === UserType.Owner ? <AddHousePage navigate={navigate} addHouse={handleAddHouse} /> : <HomePage houses={displayedHouses} navigate={navigate} currentUser={currentUser} />;
      case 'profile':
        return currentUser ? <ProfilePage navigate={navigate} /> : <LoginPage />;
      case 'home':
      default:
        return <HomePage houses={displayedHouses} navigate={navigate} currentUser={currentUser} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen flex flex-col font-sans">
        <Header navigate={navigate} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderContent()}
        </main>
        <footer className="bg-slate-800 text-white text-center p-4">
          <p>&copy; {new Date().getFullYear()} To-Let Finder. All rights reserved.</p>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}