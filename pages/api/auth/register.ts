import type { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  RegexHelper,
  findUser,
  insertUser,
  hashPassword,
} from '@/utils/index';

async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!RegexHelper.email.test(email)) {
      res.status(422).json({ message: 'Please input a valid email!' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(422).json({ message: 'Password must have 6 characters!' });
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
      const userData = {
        email: email,
        password: await hashPassword(password),
      };
      const user = await insertUser(client, userData);

      res.status(201).json({
        message: 'Successfully registered new user',
        user: { email: email, _id: user.insertedId },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Database problem' });
    }

    client.close();
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default register;
