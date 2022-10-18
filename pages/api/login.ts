import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { RegexHelper } from '../../utils';



async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!RegexHelper.email.test(email) || !password || password.trim() === '') {
      res.status(422).json({ message: 'Invalid email or password !' });
      return;
    }

    const client = await MongoClient.connect(MONGO_API);
    const database = client.db();
    const user = await database.collection('users').findOne({
      email: email,
    });

    client.close();

    if (user?.password === password) {
      res.status(200).json({
        message: 'Successfully logged in ',
        user: { email },
      });
    } else {
      res.status(403).json({ message: 'Incorrect email or password!' });
    }
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default login;
