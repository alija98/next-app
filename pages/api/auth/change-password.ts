import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import {
  connectToDatabase,
  findUser,
  verifyPassword,
  hashPassword,
  changePassword,
} from '../../../utils';
import { authOptions } from './[...nextauth]';

async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { oldPassword, newPassword } = req.body.body;

    const session = await unstable_getServerSession(req, res, authOptions);
    console.log(session);

    if (!session) {
      res
        .status(401)
        .json({ type: 'NOT_LOGGED', message: 'User is not logged in!' });
      return;
    }

    if (
      !oldPassword ||
      oldPassword?.length < 6 ||
      !newPassword ||
      newPassword?.length < 6
    ) {
      res.status(422).json({ message: 'Password must have 6 characters' });
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
      user = await findUser(client, session.user?.email || '');
      console.log('USER JE', user);

      const isValid = await verifyPassword(oldPassword, user?.password);
      if (!isValid) {
        res.status(401).json({ message: 'Incorrect password' });
        return;
      }
      const hashedPassword = await hashPassword(newPassword);

      await changePassword(client, session.user?.email || '', hashedPassword);
      res.status(200).json({ message: 'Password successfully edited' });
    } catch (error) {
      res.status(500).json({ message: 'Database problem' });
      return;
    }
    client.close();
  } else {
    res.status(400).json({ message: 'This route does not exists' });
  }
}

export default login;
