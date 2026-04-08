import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from "resend";
import { Redis } from '@upstash/redis';

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key' ? new Resend(process.env.RESEND_API_KEY) : null;
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
        
        // Notify @bo
        if (resend && process.env.NOTIFICATION_EMAIL) {
          try {
            await resend.emails.send({
              from: "AdaptiveSensing Gateway <onboarding@resend.dev>",
              to: process.env.NOTIFICATION_EMAIL,
              subject: `New Enterprise Lead: ${user.email}`,
              html: `
                <h2>New Prospect Captured!</h2>
                <p><strong>Name:</strong> ${user.name || "Unknown"}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p>This user just bypassed the paywall and requested simulation dashboard access.</p>
                <p><a href="https://console.upstash.com/">Log in to Upstash Console</a> to view the master list.</p>
              `
            });
          } catch (e) {
            console.error("Failed to send lead email", e);
          }
        }
      }
    }
  }
});

export { handler as GET, handler as POST };
