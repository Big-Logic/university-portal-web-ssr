import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/session";
import { forwardApiRequest } from "@/lib/server-api";

export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: { message: "Not signed in" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { data, status } = await forwardApiRequest(`/api/v1/users/${id}/role`, {
    method: "PATCH",
    accessToken,
    body,
  });

  return NextResponse.json(data, { status });
}
