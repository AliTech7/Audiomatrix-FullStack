import NextAuth, { AuthOptions, SessionStrategy, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { publicClient as client } from '@/lib/sanity';


declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      createdAt?: string;
    } & DefaultSession['user'];
  }
}

interface CustomUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface CustomJWT extends JWT {
  id?: string;
  createdAt?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          );

          if (!user) return null;

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user._createdAt,
          } as CustomUser;
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    // No MaxAge - Session ends on browser close
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // No MaxAge - browser session cookie
      },
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.createdAt = customUser.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customToken = token as CustomJWT;
        session.user.id = customToken.id;
        session.user.createdAt = customToken.createdAt;
      }
      return session;
    }
  },
  debug: false,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
