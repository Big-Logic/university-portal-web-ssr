import { NextResponse } from "next/server";
import { forwardApiRequest } from "@/lib/server-api";

export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const { data, status } = await forwardApiRequest(`/api/v1/users/${id}/role`, {
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
}
