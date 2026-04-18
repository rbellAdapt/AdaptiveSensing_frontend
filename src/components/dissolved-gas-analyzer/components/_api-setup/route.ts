import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const endpoint = payload._route || 'bca-gas-mixing';
    
    // Explicitly strip the internal routing param before forwarding
    delete payload._route;

    // Securely retrieve the hidden environment variables
    const baseUrl = process.env.BCA_API_URL || 'http://localhost:8000';
    const apiKey = process.env.BCA_API_KEY || '';

    const backendRes = await fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Backend calculation failed.' },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { detail: 'Internal Server Error fetching from backend component.' },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    const baseUrl = process.env.BCA_API_URL || 'http://localhost:8000';
    await fetch(`${baseUrl}/health`, { method: 'GET' });
    return new NextResponse(null, { status: 200 });
  } catch (e) {
    return new NextResponse(null, { status: 200 }); // Gracefully ignore fail
  }
}
