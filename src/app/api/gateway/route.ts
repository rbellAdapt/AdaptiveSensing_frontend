import { NextResponse } from 'next/server';

// Temporary In-Memory Store for Dev Rate Limiting (Phase 1 Stub)
// In Phase 2, this will be migrated to Vercel Postgres or Supabase.
const ipTracker: Record<string, number> = {};

export async function POST(request: Request) {
  try {
    // 1. Enforce Traffic Control (Anonymous IP vs Authenticated Token)
    // NextAuth integration goes here in the future
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Check usage
    const currentUsage = ipTracker[ip] || 0;
    
    // Artificial 3-Simulation Limit for Unauthenticated Users
    if (currentUsage >= 3) {
      return NextResponse.json(
        { error: 'Enterprise Batch Limit Reached', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }
    
    // Increment the simulation tracker
    ipTracker[ip] = currentUsage + 1;

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
      usage_count: ipTracker[ip],
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
