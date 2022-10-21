import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase, verifyPassword } from '../../../utils';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      //@ts-ignore
      async authorize(credentials: any) {
        const client = await connectToDatabase();
        const database = client.db();
        const user = await database.collection('users').findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Your password is not valid');
        }
        client.close();
        return {
          email: user.email,
        };
      },
    }),
  ],
});
