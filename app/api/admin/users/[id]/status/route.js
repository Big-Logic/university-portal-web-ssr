import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/api/server";

// Express exposes deactivate/reactivate as two separate endpoints with
// no body -- this collapses them into one { active } toggle for the
// form to call, since which underlying endpoint that maps to is an
// implementation detail the UI shouldn't need to know.
export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const action = body?.active ? "reactivate" : "deactivate";

  const { data, status } = await serverRequest(`/api/v1/users/${id}/${action}`, {
    method: "PATCH",
  });

  return NextResponse.json(data, { status });
}
