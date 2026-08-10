import { z } from "zod";
import { staffRoleField } from "./roles";

// Changing an existing user's role. The role is the only mutable field
// on this form -- profile edits go through their own schema.
export const updateUserRoleSchema = z.object({
  role: staffRoleField,
});
