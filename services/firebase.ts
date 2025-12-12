
// @ts-ignore
import { initializeApp } from 'firebase/app';
// @ts-ignore
import { getFirestore } from 'firebase/firestore';

// --------------------------------------------------------
// CONFIGURATION
// --------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDi4K0XfnWP2_l78A2MlqLds92GS9iEtY0",
  authDomain: "rentloo-df85c.firebaseapp.com",
  projectId: "rentloo-df85c",
  storageBucket: "rentloo-df85c.firebasestorage.app",
  messagingSenderId: "612936823678",
  appId: "1:612936823678:web:4ad972216ddb838550792f",
  measurementId: "G-ZHM0X6BXWZ"
};

// Initialize variables
let app = null;
let db = null;

try {
  // Initialize Firebase App
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore Database
  db = getFirestore(app);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Export the database instance for use in other files
export { db };
