import { z } from "zod";

// Matches the backend's STAFF_ROLES (users.validators.js) -- "student"
// is deliberately excluded, student accounts are created exclusively
// through /api/v1/students.
export const STAFF_ROLES = ["faculty", "registrar", "finance", "admin"];

// Both the create-user and change-role forms validate the same field
// against the same list, so the field is defined once here rather than
// twice with a message that could drift. Zod schemas are immutable, so
// sharing one instance across both object schemas is safe.
export const staffRoleField = z.enum(STAFF_ROLES, {
  error: `Role must be one of: ${STAFF_ROLES.join(", ")}`,
});
