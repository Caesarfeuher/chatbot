// pages/api/history.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../db';
import Message from '../models/messageModel';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const history = await Message.find({});
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
