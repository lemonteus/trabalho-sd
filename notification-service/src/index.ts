import express from 'express';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

// Configuração da Web Push
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:lemonsmateus@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/notify', async (req, res) => {
  const { title, body } = req.body;
  try {
    const response = await fetch('http://localhost:3001/subscriptions');
    const subscriptions = await response.json();

    const notifications = subscriptions.map((subscription: any) =>
      webpush.sendNotification(subscription, JSON.stringify({ title, body })).catch(error => {
        if (error.statusCode === 410) {
          // Remove expired subscription
          console.log('Removing expired subscription:', subscription.endpoint);
          const response = fetch('http://localhost:3001/unsubscribe', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
          });
        }
        throw error;
      })
    );

    await Promise.all(notifications);
    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});


app.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});


app.listen(PORT, () => {
  console.log(`Notification service running on http://localhost:${PORT}`);
});
