import { redirect } from "next/navigation";
import { Home, Users, Layers, BookOpen, CalendarRange, Presentation } from "lucide-react";

// Single source of truth for "which modules does this role see". The
// dashboard shell (sidebar/header) is identical for every role -- this
// config is the ONLY thing that varies per user, per the module-based
// navigation this app is built around.
export const NAV_BY_ROLE = {
  admin: [
    { label: "Home", href: "/dashboard/adminhome", icon: Home },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
      description: "Provision accounts and manage staff roles.",
    },
  ],
  registrar: [
    { label: "Home", href: "/dashboard/registrarhome", icon: Home },
    {
      label: "Programs",
      href: "/dashboard/programs",
      icon: Layers,
      description: "Browse the academic programs on file.",
    },
    {
      label: "Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
      description: "Browse the course catalog.",
    },
    {
      label: "Course Offerings",
      href: "/dashboard/courseofferings",
      icon: CalendarRange,
      description: "See which sections are running, and who's teaching them.",
    },
  ],
  faculty: [
    { label: "Home", href: "/dashboard/facultyhome", icon: Home },
    {
      label: "My Teaching",
      href: "/dashboard/myteaching",
      icon: Presentation,
      description: "Your assigned course offerings for this term.",
    },
  ],
  student: [{ label: "Home", href: "/dashboard/home", icon: Home }],
};

// Roles the API can issue (users.validators.js VALID_ROLES) that don't
// have a module set of their own yet (e.g. "finance") fall back to the
// generic session page rather than a 404.
const FALLBACK_NAV = [{ label: "Home", href: "/dashboard", icon: Home }];

export function navForRole(role) {
  return NAV_BY_ROLE[role] || FALLBACK_NAV;
}

export function homePathForRole(role) {
  return navForRole(role)[0].href;
}

/**
 * Server Component guard for role-specific pages. The sidebar already
 * hides links a user's role can't see, but a URL is always guessable
 * -- this is the actual boundary, sending a mismatched role back to
 * their own home instead of rendering another role's module.
 */
export function assertRole(user, role) {
  if (user.role !== role) {
    redirect(homePathForRole(user.role));
  }
}
