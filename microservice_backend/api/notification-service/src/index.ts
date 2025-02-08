import { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';

// Generate or use your pre-generated VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method === 'GET') {
    // Return the VAPID public key
    return res.status(200).json({ publicKey: vapidKeys.publicKey });
  } else if (req.method === 'POST') {
    const { title, body } = req.body;
    try {
      const response = await fetch('https://trabalho-sd.vercel.app/api/subscription-service');
      const subscriptions = await response.json();
  
      const notifications = subscriptions.map((subscription: any) =>
        webpush.sendNotification(subscription, JSON.stringify({ title, body })).catch(error => {
          if (error.statusCode === 410) {
            console.log('Removing expired subscription:', subscription.endpoint);
            // Optionally remove subscription from storage
          }
          throw error;
        })
      );
  
      await Promise.all(notifications);
      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });

  }
}