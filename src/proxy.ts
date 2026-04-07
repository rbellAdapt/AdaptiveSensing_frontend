import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis instance only if ENV vars exist (prevents local lockups if unbound)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }) 
  : null;

// Allow a maximum of 20 heavy physics simulations per minute per IP Address (Accommodate shared public IPs)
const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
}) : null;

export default async function proxy(request: NextRequest) {
  const isUAS = request.nextUrl.pathname.startsWith('/api/simulate/');
  const isGas = request.nextUrl.pathname.startsWith('/api/bca-');

  if (isUAS || isGas) {
    
    // --- IP RATE LIMITING (Option 1) ---
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for") ?? '127.0.0.1';
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      
      if (!success) {
        return NextResponse.json(
          { error: "Maximum simulation requests exceeded. Please wait a minute before running another." },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        );
      }
    }

    // --- AUTHENTICATION PROXY ---
    const requestHeaders = new Headers(request.headers)
    // Securely embed the API key from your Vercel/Node environment
    const apiKey = isUAS ? process.env.UAS_API_KEY : process.env.DG_API_KEY;
    requestHeaders.set('X-API-Key', apiKey || '')
    
    // Return Next response allowing the proxy rewrite to continue with injected secrets
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }
  
  return NextResponse.next()
}
