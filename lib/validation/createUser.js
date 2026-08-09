import { z } from "zod";
import { staffRoleField } from "./roles";
import { profileFields } from "./userProfile";

// The admin "add staff member" form. Students aren't creatable here --
// see the note on STAFF_ROLES in ./roles.
export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  ...profileFields,
  role: staffRoleField,
});
