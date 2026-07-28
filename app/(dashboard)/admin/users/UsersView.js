"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { toast } from "sonner";
import { UserPlus, ShieldCheck, Ban, RotateCcw } from "lucide-react";
import { rt } from "@/lib/theme";
import { clientRequest } from "@/lib/client-api";
import { Card, Alert } from "@/components/ui/primitives";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { createUserSchema, STAFF_ROLES } from "@/lib/validation";

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 8px;
`;

const Heading = styled.h1`
  font-size: 26px;
  margin: 0 0 ${({ theme }) => rt(theme).space[2]};
`;

const Sub = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 0 0 ${({ theme }) => rt(theme).space[8]};
  max-width: 640px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => rt(theme).space[6]};
  align-items: start;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  margin: 0 0 4px;
`;

const CardHint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};
`;

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink900};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Select = styled.select`
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: 10px 14px;
  font-family: ${({ theme }) => rt(theme).font.sans};
  font-size: 14px;
  background: ${({ theme }) => rt(theme).color.ink50};
  border: 1.5px solid ${({ theme }) => rt(theme).color.ink150};
  color: ${({ theme }) => rt(theme).color.ink900};

  &:focus {
    outline: none;
    background: ${({ theme }) => rt(theme).color.white};
    border-color: ${({ theme }) => rt(theme).color.blue600};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CredentialLine = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12.5px;
  margin: 4px 0 0;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: ${({ theme }) => rt(theme).space[4]} 0;
`;

function roleOptions() {
  return STAFF_ROLES.map((role) => (
    <option key={role} value={role}>
      {role[0].toUpperCase() + role.slice(1)}
    </option>
  ));
}

function CreateUserCard({ onCreated }) {
  const [serverError, setServerError] = useState(null);
  const [created, setCreated] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createUserSchema), defaultValues: { role: "faculty" } });

  const createMutation = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/admin/users", {
        body: values,
        fallbackMessage: "Couldn't create that account.",
      }),
    onSuccess: (data, variables) => {
      toast.success(`Account created for ${data.email}`);
      setCreated(data);
      onCreated?.(data.id);
      reset({ email: "", full_name: "", role: variables.role });
    },
    onError: (err) => setServerError(err.message),
  });

  function onSubmit(values) {
    setServerError(null);
    createMutation.mutate(values);
  }

  return (
    <Card>
      <CardTitle>Create a staff account</CardTitle>
      <CardHint>
        Student accounts aren&rsquo;t created here -- they come from the enrollment flow instead.
      </CardHint>

      <FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field
          label="Full name"
          placeholder="Jordan Casey"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <Field
          label="Email address"
          type="email"
          placeholder="jordan.casey@university.edu"
          error={errors.email?.message}
          {...register("email")}
        />
        <Label htmlFor="role">
          Role
          <Select id="role" {...register("role")}>
            {roleOptions()}
          </Select>
        </Label>

        {serverError && <Alert $tone="danger" role="alert">{serverError}</Alert>}

        <Button type="submit" loading={createMutation.isPending} loadingText="Creating…">
          <UserPlus size={15} aria-hidden="true" />
          Create account
        </Button>
      </FormEl>

      {created && (
        <>
          <Divider />
          <Alert $tone="success">
            <div>
              Account #{created.id} created for {created.email}.
              <CredentialLine>Temporary password: {created.generatedPassword}</CredentialLine>
              <CredentialLine>Share this once -- it won&rsquo;t be shown again.</CredentialLine>
            </div>
          </Alert>
        </>
      )}
    </Card>
  );
}

function ManageUserCard({ presetId }) {
  const [userId, setUserId] = useState(presetId || "");
  const [role, setRole] = useState(STAFF_ROLES[0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const idValid = /^\d+$/.test(String(userId).trim());

  const statusMutation = useMutation({
    mutationFn: ({ userId: id, active }) =>
      clientRequest(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        body: { active },
        fallbackMessage: "That update failed.",
      }),
    onSuccess: (data) => {
      toast.success(`Account #${data.id} is now ${data.is_active ? "active" : "deactivated"}.`);
      setResult(data);
    },
    onError: (err) => setError(err.message),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId: id, role: newRole }) =>
      clientRequest(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: { role: newRole },
        fallbackMessage: "That update failed.",
      }),
    onSuccess: (data) => {
      toast.success(
        data.changed ? `Account #${data.id} is now ${data.role}.` : `Account #${data.id} already has that role.`
      );
      setResult(data);
    },
    onError: (err) => setError(err.message),
  });

  function callStatus(active) {
    if (!idValid) {
      setError("Enter a numeric user ID first.");
      return;
    }
    setError(null);
    statusMutation.mutate({ userId, active });
  }

  function handleRoleUpdate(e) {
    e.preventDefault();
    if (!idValid) {
      setError("Enter a numeric user ID first.");
      return;
    }
    setError(null);
    roleMutation.mutate({ userId, role });
  }

  return (
    <Card>
      <CardTitle>Update an existing account</CardTitle>
      <CardHint>There&rsquo;s no account directory yet -- act on an account by its ID.</CardHint>

      <FormEl onSubmit={handleRoleUpdate}>
        <Field
          label="User ID"
          inputMode="numeric"
          placeholder="e.g. 42"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Label htmlFor="manage-role">
          New role
          <Select id="manage-role" value={role} onChange={(e) => setRole(e.target.value)}>
            {roleOptions()}
          </Select>
        </Label>

        {error && <Alert $tone="danger" role="alert">{error}</Alert>}

        <ButtonRow>
          <Button type="submit" variant="secondary" loading={roleMutation.isPending} loadingText="Updating…">
            <ShieldCheck size={15} aria-hidden="true" />
            Update role
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => callStatus(false)}
            loading={statusMutation.isPending && statusMutation.variables?.active === false}
            loadingText="Deactivating…"
          >
            <Ban size={15} aria-hidden="true" />
            Deactivate
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => callStatus(true)}
            loading={statusMutation.isPending && statusMutation.variables?.active === true}
            loadingText="Reactivating…"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reactivate
          </Button>
        </ButtonRow>
      </FormEl>

      {result && (
        <>
          <Divider />
          <Alert $tone="info">
            Account #{result.id} ({result.email}) is now{" "}
            {"role" in result ? result.role : result.is_active ? "active" : "deactivated"}.
          </Alert>
        </>
      )}
    </Card>
  );
}

export default function UsersView() {
  const [lastCreatedId, setLastCreatedId] = useState(null);

  return (
    <div>
      <Eyebrow>Users</Eyebrow>
      <Heading>Provision and manage staff accounts</Heading>
      <Sub>
        Create faculty, registrar, finance, and admin accounts, and change an existing account&rsquo;s role or
        active status.
      </Sub>

      <Grid>
        <CreateUserCard onCreated={setLastCreatedId} />
        <ManageUserCard key={lastCreatedId || "empty"} presetId={lastCreatedId} />
      </Grid>
    </div>
  );
}
