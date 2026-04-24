import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const next = request.nextUrl.searchParams.get('next') || '/';

    if (!refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const apiRes = await api.get('auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // 👉 берём токены из ответа
    const { accessToken, refreshToken: newRefreshToken } = apiRes.data ?? {};

    if (accessToken) {
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
      });
    }

    if (newRefreshToken) {
      cookieStore.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        path: '/',
      });
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    logErrorResponse({ message: (error as Error).message });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}