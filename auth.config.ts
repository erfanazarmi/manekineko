import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnHomePage = nextUrl.pathname === "/";
      const isOnLoginPage = nextUrl.pathname === "/login";
      const isOnSignupPage = nextUrl.pathname === "/signup";
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if ((isOnHomePage || isOnLoginPage || isOnSignupPage) && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
