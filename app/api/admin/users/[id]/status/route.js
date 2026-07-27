import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/session";
import { forwardApiRequest } from "@/lib/server-api";

// Express exposes deactivate/reactivate as two separate endpoints with
// no body -- this collapses them into one { active } toggle for the
// form to call, since which underlying endpoint that maps to is an
// implementation detail the UI shouldn't need to know.
export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: { message: "Not signed in" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const action = body?.active ? "reactivate" : "deactivate";

  const { data, status } = await forwardApiRequest(`/api/v1/users/${id}/${action}`, {
    method: "PATCH",
    accessToken,
  });

  return NextResponse.json(data, { status });
}
