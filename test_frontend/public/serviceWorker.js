// Import Firebase scripts for Service Workers
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration (keep this consistent with your FirebaseService)
const firebaseConfig = {
  apiKey: "AIzaSyCcJv8CYnLIXV4-LaEZyAnkLFTaRnuUsEk",
  authDomain: "trabalho-sd-3be92.firebaseapp.com",
  projectId: "trabalho-sd-3be92",
  storageBucket: "trabalho-sd-3be92.firebasestorage.app",
  messagingSenderId: "540001656759",
  appId: "1:540001656759:web:92e0e0fc2a4a0574bad232",
  measurementId: "G-DG2LYLMN87",
};

// Initialize Firebase in the Service Worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message:', payload);

  const notificationTitle = payload.notification.title || 'Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message!',
    icon: payload.notification.icon || '/favicon.ico',
  };

  // Show notification to the user
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Add push event listener
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  const data = event.data.json();
  console.log(`[Service Worker] Push had this data: "${data}"`);

  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: data.icon || '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
