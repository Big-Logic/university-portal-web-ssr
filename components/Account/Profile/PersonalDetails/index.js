"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfileSchema } from "@/lib/validation/updateProfile";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { Alert, Badge } from "@/components/ui/primitives";
import Shared from "../Profile.style";
import { LOCALES, TIMEZONE_OPTIONS, withCurrent } from "./constants";
import S from "./PersonalDetails.style";

// null is what the API sends for an unset column; a controlled input
// needs "". Kept in one place so the reset after a save maps the
// server's answer back the same way the first render mapped it.
function toFormValues(user) {
  return {
    firstName: user.firstName ?? "",
    middleName: user.middleName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    timezone: user.timezone ?? "",
    locale: user.locale ?? "",
  };
}

/**
 * Owns its own form state, the same split as the auth forms: the view
 * above only needs to know a submit happened and what came back, not
 * which fields exist.
 *
 * Every field here is one the account holder may set about themselves.
 * The three below the divider are the ones they may not -- shown
 * rather than hidden, because "why can't I change my email" is a
 * question this card should answer on sight.
 */
export default function PersonalDetails({ user, onSave, isPending, error }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: toFormValues(user),
  });

  function onSubmit(values) {
    onSave(values, {
      onSuccess: (updated) => {
        // Reset from the server's copy, not from `values`: the API
        // trims and normalises, and re-basing the form on what was
        // actually stored is what makes isDirty honest afterwards.
        reset(toFormValues(updated));
        toast.success("Your details were saved.");
      },
    });
  }

  // `value` is a node, not a string, so status can carry its own
  // colour. It's the one row here that isn't just a fact about the
  // account -- it's the difference between being able to sign in and
  // not -- and a badge is how that reads everywhere else in the app.
  const managed = [
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
    {
      label: "Status",
      value: (
        <Badge $tone={user.isActive ? "success" : "danger"}>
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <Shared.Panel>
      <Shared.PanelTitle>Personal details</Shared.PanelTitle>
      <Shared.PanelSub>Changes take effect right away.</Shared.PanelSub>

      <S.FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert $tone="danger" role="alert">
            {error}
          </Alert>
        )}

        <S.Row $cols={3}>
          <Field
            label="First name"
            placeholder="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Field
            label="Middle name"
            placeholder="Optional"
            autoComplete="additional-name"
            error={errors.middleName?.message}
            {...register("middleName")}
          />
          <Field
            label="Last name"
            placeholder="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </S.Row>

        <S.Row>
          <Field
            label="Phone"
            type="tel"
            placeholder="+231 775 123 456"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Field
            label="Date of birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
        </S.Row>

        <S.Row>
          <Select
            label="Time zone"
            error={errors.timezone?.message}
            {...register("timezone")}
          >
            {withCurrent(TIMEZONE_OPTIONS, user.timezone).map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </Select>
          <Select
            label="Language"
            error={errors.locale?.message}
            {...register("locale")}
          >
            {withCurrent(LOCALES, user.locale).map((locale) => (
              <option key={locale.value} value={locale.value}>
                {locale.label}
              </option>
            ))}
          </Select>
        </S.Row>

        <S.Managed>
          <S.ManagedTitle>Managed by your institution</S.ManagedTitle>
          {managed.map((row) => (
            <Shared.MetaRow key={row.label}>
              <Shared.MetaLabel>{row.label}</Shared.MetaLabel>
              <Shared.MetaValue>{row.value}</Shared.MetaValue>
            </Shared.MetaRow>
          ))}
        </S.Managed>

        <S.Actions>
          <Button
            type="submit"
            disabled={!isDirty}
            loading={isPending}
            loadingText="Saving…"
          >
            Save changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={!isDirty || isPending}
            onClick={() => reset(toFormValues(user))}
          >
            Discard changes
          </Button>
        </S.Actions>
      </S.FormEl>
    </Shared.Panel>
  );
}
