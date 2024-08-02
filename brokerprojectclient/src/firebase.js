// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "broker-1adbf.firebaseapp.com",
  projectId: "broker-1adbf",
  storageBucket: "broker-1adbf.appspot.com",
  messagingSenderId: "568820061546",
  appId: "1:568820061546:web:2edef8f3bb8c4c56078113",
  measurementId: "G-E7ZM9G9J3B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);