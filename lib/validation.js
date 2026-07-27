import { z } from "zod";

// Matches the backend's loginSchema (auth.validators.js) exactly --
// keeping both in sync means a validation error never surprises the
// user by disagreeing between client and server.
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Matches the backend's STAFF_ROLES (users.validators.js) -- "student"
// is deliberately excluded, student accounts are created exclusively
// through /api/v1/students.
export const STAFF_ROLES = ["faculty", "registrar", "finance", "admin"];

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  full_name: z.string().min(1, "Full name is required").max(255),
  role: z.enum(STAFF_ROLES, { error: `Role must be one of: ${STAFF_ROLES.join(", ")}` }),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(STAFF_ROLES, { error: `Role must be one of: ${STAFF_ROLES.join(", ")}` }),
});
