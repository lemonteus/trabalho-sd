// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcJv8CYnLIXV4-LaEZyAnkLFTaRnuUsEk",
  authDomain: "trabalho-sd-3be92.firebaseapp.com",
  projectId: "trabalho-sd-3be92",
  storageBucket: "trabalho-sd-3be92.firebasestorage.app",
  messagingSenderId: "540001656759",
  appId: "1:540001656759:web:92e0e0fc2a4a0574bad232",
  measurementId: "G-DG2LYLMN87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

getToken(messaging, {vapidKey: "BN9Z8QQ6kOFeX5ATQPPsitw6STwZc-MJ3bZB-fm9BvnQJ-Aa5xaxwKc1Rz0m7Esgx9sqYx4eM58QY-D1WBT7fnM"});