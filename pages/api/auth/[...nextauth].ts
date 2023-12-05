import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "salit" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("authorize", credentials);

        if (!credentials) {
          return null;
        }

        const password =
          process.env[`${credentials.username.toUpperCase()}_PASS}`];
        if (credentials.password !== password) {
          return null;
        }

        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "Salit_User", email: "" };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
