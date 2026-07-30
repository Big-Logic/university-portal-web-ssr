// Client-side mirror of lib/server-api.js's pattern, but throws on
// failure instead of returning early with a useState setter -- that's
// the contract React Query's useMutation's `mutationFn` expects
// (throw = error state, resolve = success state).
export async function clientRequest(
  path,
  {
    method = "GET",
    body,
    fallbackMessage = "Request failed! Connect to the internet and try again!",
  } = {},
) {
  let res;
  try {
    res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(
      "Couldn't reach the server. Check your connection and try again.",
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error?.message || fallbackMessage);
  }

  return data;
}
