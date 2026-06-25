import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: 'Server misconfiguration: Password not set' }, { status: 500 });
    }

    if (password === correctPassword) {
      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_auth_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    return NextResponse.json({ error: 'Password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_auth_token');
  return response;
}
