// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK_Bo77ZCW0Io7kgIZIbshVcrVAK070BA",
  authDomain: "tolet-finder-57688.firebaseapp.com",
  projectId: "tolet-finder-57688",
  storageBucket: "tolet-finder-57688.firebasestorage.app",
  messagingSenderId: "996671076147",
  appId: "1:996671076147:web:3d4ceccaf87200ff8ff046",
  measurementId: "G-CYV4RH1NNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

export default app;