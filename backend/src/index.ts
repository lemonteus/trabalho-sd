import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());

// Array para armazenar as assinaturas
const subscriptions: webpush.PushSubscription[] = [];

// Configuração da Web Push
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:lemonsmateus@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());

// Endpoint para registrar assinaturas de clientes
app.post('/subscribe', (req: Request, res: Response) => {
  const subscription: webpush.PushSubscription = req.body;
  try {
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add subscription', error });
  }
});

// Endpoint para enviar notificações
app.post('/notify', async (req, res) => {
  const { title, body } = req.body;
  try {
    const notifications = subscriptions.map(subscription =>
      webpush.sendNotification(subscription, JSON.stringify({ title, body }))
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
  console.log(`Backend server running on http://localhost:${PORT}`);
});
