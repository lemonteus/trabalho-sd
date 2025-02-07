import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {onRequest} from "firebase-functions/v2/https";

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());

const users: any[] = [];

app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json({ message: 'User added successfully' });
});

app.get('/users', (req, res) => {
  res.json(users);
});

export const userService = onRequest(app);