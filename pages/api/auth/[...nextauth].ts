import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

import { connectToDatabase, verifyPassword } from '@/utils/index';

export const authOptions: NextAuthOptions = {
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
          name: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
