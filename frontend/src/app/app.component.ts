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

  private rootUrl: string = 'https://trabalho-sd.vercel.app';
  private apiUrl: string = `${this.rootUrl}/api`;

  async getPublicVAPIDKey(): Promise<string> {
    //get VAPID key from notification server
    const response = await fetch(`${this.apiUrl}/notification-service`);
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
      const registration = await navigator.serviceWorker.register(`${this.rootUrl}/frontend/serviceWorker.js`);

      console.log('Service Worker registered with scope:', registration.scope);

      // Check for existing subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
        console.log('Unsubscribed from existing subscription.');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVAPIDKey,
      });

      await fetch(`${this.apiUrl}/subscription-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      alert("Subscription was a success");
      console.log('Subscription:', subscription);
    } catch (error) {
      console.error('Error during service worker registration:', error);
    }
  }

  sendNotification(): void {
    if (this.notificationText.trim()) {
      console.log('Sending notification:', this.notificationText);

      fetch(`${this.apiUrl}/notification-service`, {
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
