import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login", // tambahkan ini
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ profile }) {
      const admins =
        process.env.ADMIN_EMAILS?.split(",").map(email => email.trim()) ?? [];

      return admins.includes(profile?.email ?? "");
    },
  },
});
