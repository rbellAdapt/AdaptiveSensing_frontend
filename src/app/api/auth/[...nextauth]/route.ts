import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Redis } from '@upstash/redis';
const redis = process.env.UPSTASH_REDIS_REST_URL?.startsWith('https') && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      if (user?.email) {
        // Drop into Database
        if (redis) {
          // Keep a list of unique captured leads
          await redis.sadd("captured_leads", user.email);
        }
        
        // Notify @bo via Google Sheets Webhook
        const scriptURL = process.env.NEXT_PUBLIC_ENTERPRISE_SCRIPT_URL;
        if (scriptURL) {
          try {
            const emailParam = encodeURIComponent(user.email);
            const nameParam = encodeURIComponent(user.name || "Unknown");
            await fetch(`${scriptURL}?type=casual&email=${emailParam}&name=${nameParam}`, {
              method: 'GET'
            });
          } catch (e) {
            console.error("Failed to hit Google Sheets webhook", e);
          }
        }
      }
    }
  }
});

export { handler as GET, handler as POST };
