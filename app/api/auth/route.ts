// app/api/auth/route.ts


import { NextResponse } from 'next/server';
import { api, ApiError } from '@/app/api/api';
import { cookies } from 'next/headers';


export async function GET() {
  const cookieStore = await cookies();


  try {
    const { data } = await api.get('/auth', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });


    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    )
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const body = await request.json();
  try {
	  const { data } = await api.put('/auth', body, {
	    headers: {
	      Cookie: cookieStore.toString(),
	    },
	  });
	
		return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    )
  }
}