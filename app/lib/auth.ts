import { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db('photography-portfolio');
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
