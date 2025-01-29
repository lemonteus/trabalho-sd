import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way binding
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Mark this as a standalone component
  imports: [CommonModule, FormsModule], // Add necessary Angular modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  notificationText: string = '';

  async getPublicVAPIDKey(): Promise<string> {
    const response = await fetch('http://localhost:3001/vapidPublicKey');
    const data = await response.json();  

    console.log('Public VAPID key:', data.publicKey);
    return data.publicKey;

  }

  async subscribe(): Promise<void> {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Permission not granted.');
      return;
    }
    

    if (!('serviceWorker' in navigator)) {
      alert('Service workers não são suportados neste navegador.');
      return;
    }

    try {
      const publicVAPIDKey = await this.getPublicVAPIDKey();
      const registration = await navigator.serviceWorker.register('serviceWorker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVAPIDKey,
      });

      await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      console.log('Subscription:', subscription);
    } catch (error) {
      console.error('Error during service worker registration:', error);
    }
  }

  sendNotification(): void {
    if (this.notificationText.trim()) {
      console.log('Sending notification:', this.notificationText);

      fetch('http://localhost:3001/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Notification', body: this.notificationText }),
      });

    } else {
      alert('Please enter a notification message.');
    }
  }
}
