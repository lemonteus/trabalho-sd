import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {onRequest} from "firebase-functions/v2/https";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const subscriptions: any[] = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  
  if(getSubscriptionIndex(subscription.endpoint, subscription) !== -1) {
    res.status(400).json({ message: 'Subscription already exists' });
  }

  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription added successfully' });
});

app.delete('/unsubscribe', (req, res) => {
  const subscription = req.body;
  const index = getSubscriptionIndex(subscription.endpoint, subscription);
  if (index !== -1) {
    subscriptions.splice(index, 1);
  }
  res.status(200).json({ message: 'Subscription removed successfully' });
});

app.get('/subscriptions', (req, res) => {
  res.json(subscriptions);
});

export const subscriptionService = onRequest(app);

function getSubscriptionIndex(endpoint: string, subscription: any): number {
  return subscriptions.findIndex(sub => sub.endpoint === subscription.endpoint);
}