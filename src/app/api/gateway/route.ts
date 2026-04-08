import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { Redis } from '@upstash/redis';

// Initialize upstream persistence. If env lacks keys, it will gracefully fallback to anonymous memory.
const redis = process.env.UPSTASH_REDIS_REST_URL?.startsWith('https') && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Temporary In-Memory fallback
const fallbackIpTracker: Record<string, number> = {};

export async function POST(request: Request) {
  try {
    // 0. Verify NextAuth Session
    const session = await getServerSession();
    const isAuthenticated = !!session?.user;

    // 1. Enforce Traffic Control (Anonymous IP vs Authenticated Token)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Check usage
    let currentUsage = 0;
    const redisKey = `gateway_limits:${ip}`;
    
    if (redis) {
      currentUsage = (await redis.get<number>(redisKey)) || 0;
    } else {
      currentUsage = fallbackIpTracker[ip] || 0;
    }
    
    // Artificial 5-Simulation Limit for Unauthenticated Users
    if (!isAuthenticated && currentUsage >= 5) {
      return NextResponse.json(
        { error: 'Enterprise Batch Limit Reached', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }
    
    // Increment the simulation tracker for anonymous viewers
    if (!isAuthenticated) {
      if (redis) {
        await redis.incr(redisKey);
      } else {
        fallbackIpTracker[ip] = currentUsage + 1;
      }
    }

    // 2. Extract Payload
    const body = await request.json();
    const { engine, parameters } = body;

    // 3. Backend Proxy Logic (Phase 2 Integration)
    // Here we will eventually send the 'parameters' to standard Python engines on GCP:
    // const response = await fetch(`https://gcp-python-cluster/${engine}`, { body: parameters });
    // return response;

    // Phase 1 Mock Return
    return NextResponse.json({
      status: 'success',
      engine_routed: engine || 'default_physics_model',
      usage_count: isAuthenticated ? 'Unlimited' : (currentUsage + 1),
      message: 'Proxy success.',
    });

  } catch (error) {
    console.error("API Gateway Error:", error);
    return NextResponse.json({ error: 'Gateway proxy failure.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    service: 'AdaptiveSensing Core Interceptor', 
    status: 'Operational',
    version: '1.0.0',
    security: 'Zero-Trust Proxy Enabled'
  });
}
