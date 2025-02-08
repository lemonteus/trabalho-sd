import { VercelRequest, VercelResponse } from '@vercel/node';

const users: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const user = req.body;
    users.push(user);
    res.status(201).json({ message: 'User added successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}