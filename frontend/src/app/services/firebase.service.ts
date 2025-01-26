import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseApp;
  private messaging: Messaging;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCcJv8CYnLIXV4-LaEZyAnkLFTaRnuUsEk",
      authDomain: "trabalho-sd-3be92.firebaseapp.com",
      projectId: "trabalho-sd-3be92",
      storageBucket: "trabalho-sd-3be92.firebasestorage.app",
      messagingSenderId: "540001656759",
      appId: "1:540001656759:web:92e0e0fc2a4a0574bad232",
      measurementId: "G-DG2LYLMN87",
    };

    // Initialize Firebase
    this.firebaseApp = initializeApp(firebaseConfig);
    this.messaging = getMessaging(this.firebaseApp);
  }

  getMessagingInstance() {
    return this.messaging;
  }
}
