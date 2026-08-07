import ForgotPasswordView from "./ForgotPasswordView";

// The reason this route has a Server Component shell at all: a
// "use client" page can't export `metadata` -- Next only reads it off a
// Server Component -- so without the split this page inherits the root
// layout's "Sign in to your university portal", which describes a
// different page.
//
// Unlike the (dashboard) pages, there's nothing to fetch here. The
// route is public (proxy.js's matcher doesn't cover it, and it has to
// stay reachable signed-out) and its only input is the address the user
// types, so this is a shell rather than a data loader.
export const metadata = {
  title: "Reset your password — Basecourse",
  description:
    "Request a link to set a new password on your Basecourse account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
