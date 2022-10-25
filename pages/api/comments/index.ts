import type { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  updateComment,
  getItemComments,
  addComment,
  deleteComment,
} from '@/utils/index';
import { MongoClient } from 'mongodb';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

async function comments(req: NextApiRequest, res: NextApiResponse) {
  let client: MongoClient,
    comments: any[] = [];
  const { comment, productCustomID, userID, commentID } = req.body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res
      .status(401)
      .json({ type: 'NOT_LOGGED', message: 'User is not logged in!' });
    return;
  }

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: 'Connecting to database failed' });
    return;
  }

  if (req.method === 'PUT') {
    try {
      console.log(session?.user?.email);

      await updateComment(client, commentID, comment);
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }

    try {
      comments = await getItemComments(client, productCustomID);
    } catch (error) {
      res.status(500).json({ message: 'Database comments problem' });
    }

    res.status(200).json({
      message: 'Successfully edited comment',
      comments: comments,
    });
    client.close();
  } else if (req.method === 'POST') {
    const userEmail = session.user?.email as string;
    try {
      await addComment(client, userID || userEmail, productCustomID, comment);
      comments = await getItemComments(client, productCustomID);

      res.status(200).json({
        message: 'Successfully added comment ',
        comments: comments,
      });
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteComment(client, commentID);
      res.status(200).json({
        message: 'Successfully deleted comment ',
      });
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default comments;
