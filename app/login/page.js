import Login from "@/components/Auth/Login";
import { APP_NAME } from "@/lib/branding";

// Server Component shell, same split as /reset-password: a "use client"
// page can't export `metadata`, since Next only reads it off a Server
// Component.
//
// Nothing is fetched here. The route is public -- proxy.js's matcher
// doesn't cover it, and it has to stay reachable signed-out -- and the
// only input is the credentials the user types, so this is a shell
// rather than a data loader. Note in particular that it does NOT
// redirect an already-signed-in visitor: that would mean reading the
// session cookie during render, and the cookie is only meaningful once
// Proxy has verified it.
//
// No Suspense boundary, unlike /reset-password -- nothing under here
// reads search params, so there's nothing to opt out of prerendering.
// Title is the page's half only -- the root layout's template appends
// the product name.
export const metadata = {
  title: "Sign in",
  description: `Sign in to your ${APP_NAME} university portal.`,
};

export default function LoginPage() {
  return <Login />;
}
