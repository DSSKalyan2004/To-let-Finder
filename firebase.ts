// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);