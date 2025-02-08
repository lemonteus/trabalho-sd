import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response } from 'express';

// Create an Express app
const app = express();
app.use(express.json());

let subscriptions: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) { 

  if (req.method === 'POST') {
    const subscription = req.body;
    console.log(subscription);
    // Check if subscription already exists
    if (subscriptions.find((sub) => sub.endpoint === subscription.endpoint)) {
      return res.status(400).json({ message: 'Subscription already exists' });
    }
    subscriptions.push(subscription);
    return res.status(201).json({ message: 'Subscription added successfully' });
  }

  if (req.method === 'DELETE') {
    const subscription = req.body;
    subscriptions = subscriptions.filter((sub) => sub.endpoint !== subscription.endpoint);
    return res.status(200).json({ message: 'Subscription removed successfully' });
  }

  if (req.method === 'GET') {
    return res.json(subscriptions);
  }

  return res.status(405).json({ message: 'Method not allowed' });

}