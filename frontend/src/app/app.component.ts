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

  async subscribe(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      alert('Service workers não são suportados neste navegador.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('serviceWorker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BN9Z8QQ6kOFeX5ATQPPsitw6STwZc-MJ3bZB-fm9BvnQJ-Aa5xaxwKc1Rz0m7Esgx9sqYx4eM58QY-D1WBT7fnM',
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
    } else {
      alert('Please enter a notification message.');
    }
  }
}
