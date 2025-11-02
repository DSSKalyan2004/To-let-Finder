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
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>(MOCK_HOUSES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // User is signed in, get their data from localStorage
          const storedUserData = localStorage.getItem('tolet-finder-user-data');
          
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name,
              type: userData.type,
            };
            setCurrentUser(user);
            
            // Also update users array if user not present
            setUsers(prevUsers => {
              const existingUser = prevUsers.find(u => u.uid === firebaseUser.uid);
              if (!existingUser) {
                return [...prevUsers, { ...user, password: '' }];
              }
              return prevUsers;
            });
          } else {
            // Fallback: try to find user in local users array
            const localUser = users.find(u => u.email === firebaseUser.email);
            if (localUser) {
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: localUser.name,
                type: localUser.type,
              };
              setCurrentUser(user);
              localStorage.setItem('tolet-finder-user-data', JSON.stringify(user));
            } else {
              console.warn("User data not found in localStorage");
              setCurrentUser(null);
              localStorage.removeItem('tolet-finder-user-data');
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
          localStorage.removeItem('tolet-finder-user-data');
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        localStorage.removeItem('tolet-finder-user-data');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from localStorage
      const storedUserData = localStorage.getItem('tolet-finder-user-data');
      let user: User;
      
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          type: userData.type,
        };
      } else {
        // Fallback: check local users array
        const localUser = users.find(u => u.email === email);
        if (localUser) {
          user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            name: localUser.name,
            type: localUser.type,
          };
          // Update users array with Firebase UID
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.email === email ? { ...u, uid: firebaseUser.uid } : u
            )
          );
        } else {
          // Create a default user profile
          user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.email!.split('@')[0],
            type: UserType.Tenant,
          };
        }
        localStorage.setItem('tolet-finder-user-data', JSON.stringify(user));
      }
      
      // Update state
      setCurrentUser(user);
      setView('home');
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please register first.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  }, [users]);

  const handleRegister = useCallback(async (name: string, email: string, password: string, type: UserType) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase user profile with display name
      await updateProfile(firebaseUser, {
        displayName: name,
      });
      
      // Create user object for app state
      const newUser: User = {
        uid: firebaseUser.uid,
        email: email,
        name: name,
        type: type,
      };
      
      // Store user data in localStorage
      localStorage.setItem('tolet-finder-user-data', JSON.stringify(newUser));
      
      // Add to users array for local state management
      setUsers(prevUsers => [...prevUsers, { ...newUser, password: password }]);
      
      // Update state
      setCurrentUser(newUser);
      setView('home');
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  }, []);
 
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem('tolet-finder-user-data');
      setView('home');
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error('Logout failed. Please try again.');
    }
  }, []);

  const handleChangePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!currentUser) {
      throw new Error("No user is signed in.");
    }
    
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No authenticated user found.");
      }
      
      // Re-authenticate user with current password
      const credential = await signInWithEmailAndPassword(auth, user.email, currentPassword);
      
      // If re-authentication successful, update password
      const { updatePassword } = await import("firebase/auth");
      await updatePassword(user, newPassword);
      
    } catch (error: any) {
      console.error("Change password error:", error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error("Incorrect current password.");
      } else if (error.code === 'auth/weak-password') {
        throw new Error("New password must be at least 6 characters long.");
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error("Please logout and login again before changing password.");
      } else {
        throw new Error(error.message || "Failed to change password.");
      }
    }
  }, [currentUser]);

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