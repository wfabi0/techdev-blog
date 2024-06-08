import NextAuth from "next-auth";
import github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [github],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/profile") return !!auth;
      return true;
    },
    redirect({ url, baseUrl }) {
      return url;
    },
    jwt({ token, trigger, session, account, profile }) {
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "github") {
        return {
          ...token,
          accessToken: account.access_token,
          profile: {
            login: profile?.login,
            id: profile?.id,
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.profile) {
        session.user.login = (token.profile as Token).login as string;
        session.user.userId = (token.profile as Token).id as number;
      }
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  // debug: process.env.NODE_ENV !== "production" ? true : false,
});

interface Token {
  login?: string;
  id?: number;
}

declare module "next-auth" {
  interface User {
    login?: string;
    userId?: number;
  }
  interface Session {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}
