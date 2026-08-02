import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/api/server";

export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const { data, status } = await serverRequest(`/api/v1/users/${id}/role`, {
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
}
