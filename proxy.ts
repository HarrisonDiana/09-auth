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

  // Если accessToken есть
  if (accessToken) {
    // Авторизованный пользователь не должен заходить на публичные auth-страницы
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Если accessToken нет, но refreshToken есть — пробуем обновить сессию
  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session.data?.accessToken) {
        const response = NextResponse.next();

        response.cookies.set("accessToken", session.data.accessToken, {
          httpOnly: true,
          path: "/",
        });

        // Если пользователь на auth-странице — отправляем домой
        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        return response;
      }
    } catch {
      // Если обновление не удалось и это приватный роут
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  // Если приватный маршрут и токенов нет
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Всё остальное пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};