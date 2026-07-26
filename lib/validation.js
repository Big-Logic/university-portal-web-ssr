import { z } from "zod";

// Matches the backend's loginSchema (auth.validators.js) exactly --
// keeping both in sync means a validation error never surprises the
// user by disagreeing between client and server.
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
