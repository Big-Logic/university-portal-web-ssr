"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientRequest } from "@/lib/api/client";
import PageIntro from "@/components/PageIntro";
import IdentityCard from "./IdentityCard";
import PersonalDetails from "./PersonalDetails";
import SignInCard from "./SignInCard";
import SessionsCard from "./SessionsCard";
import S from "./Profile.style";

/**
 * Holds the profile mutation and nothing else. Which fields exist and
 * how they validate lives in the cards; this component owns the one
 * thing two of them share -- the PATCH -- so the identity card's photo
 * and the details form's fields can't end up writing through two
 * different paths.
 *
 * `user` arrives as a prop from the Server Component, so the page
 * paints with real data on first byte and there is no loading state to
 * design. What that costs is a second copy of the same record: the
 * chrome (header, sidebar) reads its own via useCurrentUser's React
 * Query cache. The onSuccess below keeps them in step -- setQueryData
 * so the header's name updates without a refetch, router.refresh() so
 * the server render this page is built from is no longer stale.
 */
export default function Profile({ user }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/users/me", { method: "PATCH", body: values }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["currentUser"], updated);
      router.refresh();
    },
  });

  // One mutation, two cards that can trigger it -- so pending, error
  // and saved state have to be told apart, or saving a photo would put
  // a spinner and an error on the details form below it (and a "Saved"
  // it hadn't earned). `variables` is the payload of the most recent
  // call, and only the identity card ever sends an avatarUrl.
  const fromAvatar =
    !!updateProfile.variables && "avatarUrl" in updateProfile.variables;
  const message = updateProfile.error?.message;

  return (
    <S.Screen>
      <PageIntro
        eyebrow="Account"
        heading="Your profile"
        sub="Your name, photo, and preferences are yours to edit. Your email, role, and status are set by an administrator."
      />

      <S.Grid>
        <S.Column>
          {/* No `error` prop: the photo flow reports its own failures
              as toasts, since there's no form left open to sit an
              alert above once the file dialogue has closed. */}
          <IdentityCard
            user={user}
            onSave={updateProfile.mutate}
            isPending={updateProfile.isPending && fromAvatar}
          />
          <PersonalDetails
            user={user}
            onSave={updateProfile.mutate}
            isPending={updateProfile.isPending && !fromAvatar}
            error={fromAvatar ? undefined : message}
          />
        </S.Column>

        <S.Column>
          <SignInCard user={user} />
          <SessionsCard />
        </S.Column>
      </S.Grid>
    </S.Screen>
  );
}
