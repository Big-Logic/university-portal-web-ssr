import { Suspense } from "react";
import PasswordReset from "@/components/PasswordReset";

export const metadata = {
  title: "Set a new password — Basecourse",
  description: "Finish resetting the password on your Basecourse account.",
};

// The Suspense boundary is load-bearing, not decoration: PasswordReset
// calls useSearchParams(), and Next opts the whole route out of static
// prerendering unless the component reading the params sits behind one.
//
// Reading the token in the client rather than through this Server
// Component's `searchParams` prop is deliberate. It keeps a single-use
// credential out of the server render, out of the RSC payload, and out
// of anything on the server that logs request URLs.
//
// fallback={null} because the boundary resolves in the same tick on the
// client -- a spinner would flash rather than inform.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PasswordReset />
    </Suspense>
  );
}
