import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Preset admin credentials
const ADMIN_EMAIL = 'admin@andylukijr.com';
const ADMIN_PASSWORD = 'Admin@2025';

export const authOptions: NextAuthOptions = {
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

        // Check against preset admin credentials
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.sub) {
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};