// pages/api/saveMessage.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../db';
import Message from '../models/messageModel';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { question, answer } = req.body;

    try {
      const newMessage = new Message({ question, answer });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
