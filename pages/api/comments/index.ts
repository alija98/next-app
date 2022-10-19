import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, updateComment } from '../../../utils';
import { MongoClient } from 'mongodb';

async function comments(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    let client: MongoClient;

    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to database failed' });
      return;
    }

    try {
      await updateComment(
        client,
        '634fb886fd14b9e95529969c',
        'This is new comment!'
      );
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default comments;
