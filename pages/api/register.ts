import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { RegexHelper } from '../../utils';

const MONGO_API =
  'mongodb+srv://alija:alija123@atlascluster.of5ulpc.mongodb.net/nextjsProducts?retryWrites=true&w=majority';

async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!RegexHelper.email.test(email)) {
      res.status(422).json({ message: 'Please input a valid email!' });
      return;
    }
    if (!password || password.length < 5) {
      res.status(422).json({ message: 'Password must have 5 characters!' });
    }
    const client = await MongoClient.connect(MONGO_API);
    const database = client.db();
    const user = await database.collection('users').findOne({
      email: email,
    });
    client.close();
    if (user) {
      res.status(422).json({ message: 'User with this email already exists!' });
      return;
    }

    await database.collection('users').insertOne({
      email: email,
      password: password,
    });
    client.close();

    res.status(201).json({
      message: 'Successfully registered new user',
      user: { email, password },
    });
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default register;
