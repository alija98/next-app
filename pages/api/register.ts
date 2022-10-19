import type { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  RegexHelper,
  findUser,
  insertUser,
} from '../../utils';

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
    let client, user;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to database failed' });
      return;
    }
    try {
      user = await findUser(client, email);
      if (user) {
        res
          .status(422)
          .json({ message: 'User with this email already exists!' });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
    }

    try {
      await insertUser(client, { email, password });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Database problem' });
    }

    client.close();

    res.status(201).json({
      message: 'Successfully registered new user',
      user: { email },
    });
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default register;
