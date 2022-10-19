import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, RegexHelper, findUser } from '../../utils';

async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!RegexHelper.email.test(email) || !password || password.trim() === '') {
      res.status(422).json({ message: 'Invalid email or password !' });
      return;
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
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
      return;
    }
    client.close();

    if (user?.password === password) {
      res.status(200).json({
        message: 'Successfully logged in ',
        user: user,
      });
    } else {
      res.status(403).json({ message: 'Incorrect email or password!' });
    }
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default login;
