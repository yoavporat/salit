import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const password =
          process.env[`${credentials.username.toUpperCase()}_PASS`];
        if (credentials.password !== password) {
          console.log("password missmatch");
          return null;
        }

        const user = { id: "1", name: "Salit_User", email: "" };

        if (user) {
          console.log("logged in", user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
