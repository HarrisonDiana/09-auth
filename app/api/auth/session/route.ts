import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // если accessToken есть — пользователь авторизован
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    // если accessToken нет, но есть refreshToken — обновляем сессию
    if (refreshToken) {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      // берём токены из ответа API, без parse()
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = apiRes.data ?? {};

      if (newAccessToken) {
        cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          path: "/",
        });
      }

      if (newRefreshToken) {
        cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          path: "/",
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false });
    }

    logErrorResponse({ message: (error as Error).message });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}