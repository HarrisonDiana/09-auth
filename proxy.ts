import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // access token есть
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // access token нет, но refresh token есть
  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session.data?.accessToken) {
        const response = NextResponse.next();

        // сохраняем новый access token
        response.cookies.set("accessToken", session.data.accessToken, {
          httpOnly: true,
          path: "/",
        });

        // сохраняем новый refresh token, если он пришёл
        if (session.data?.refreshToken) {
          response.cookies.set("refreshToken", session.data.refreshToken, {
            httpOnly: true,
            path: "/",
          });
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        return response;
      }
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  // приватный роут без авторизации
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
}