"use client";

import { Badge } from "@/components/ui/primitives";

/**
 * Marks content that comes from lib/sample-data.js -- fabricated
 * placeholder standing in for an endpoint that doesn't exist yet.
 *
 * Every screen that renders sample data renders this beside it. The
 * rule it enforces is in CLAUDE.md: a person seeing invented data
 * presented as their own record is the failure this guards against, so
 * the badge stays until the real endpoint lands and the matching
 * export is deleted.
 *
 * Amber rather than neutral on purpose -- it's a caveat, not a label,
 * and it should read as one at a glance.
 */
export default function SampleBadge() {
  return (
    <Badge $tone="warning" title="Placeholder content — not a real record">
      Sample
    </Badge>
  );
}
