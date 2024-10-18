// js/firebase-config.js

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, collection
} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQsFjMkH4TR5vI74NH57PHicbl2GxtyYE",
  authDomain: "habitz-c2226.firebaseapp.com",
  projectId: "habitz-c2226",
  storageBucket: "habitz-c2226.appspot.com",
  messagingSenderId: "1367064140",
  appId: "1:1367064140:web:21512c177abc7e3523fee9",
  measurementId: "G-FFDHF8QTNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const db = getFirestore()

const colRef = collection(db, 'habits')
// Export the auth instance for use in other modules
export { auth };
