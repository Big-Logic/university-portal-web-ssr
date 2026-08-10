import styled from "styled-components";
import { rt } from "@/lib/style/theme";

// This card's own breakpoint, and it's about the row rather than the
// device: below roughly this width the avatar, the name and the button
// stop fitting on one line, whatever is going on elsewhere on the
// page. Deliberately not DashboardShell's BREAKPOINT (960px) -- that
// one is about the sidebar becoming a drawer, and borrowing it here
// would restyle this card at a width where it's still perfectly
// comfortable.
const STACKED = "560px";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[4]};
  flex-wrap: wrap;
`;

// Fixed 72px and `flex: none` so a slow-loading photo can't reflow the
// row around it. The image is a background rather than an <img> for
// the same reason object-fit exists: a portrait and a landscape crop
// to the same circle without either being squashed.
const Avatar = styled.div`
  width: 72px;
  height: 72px;
  flex: none;

  @media (max-width: ${STACKED}) {
    width: 56px;
    height: 56px;
  }

  border-radius: ${({ theme }) => rt(theme).radius.pill};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  background: ${({ theme }) => rt(theme).color.blue100};
  background-image: ${({ $src }) => ($src ? `url(${JSON.stringify($src)})` : "none")};
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* Dimmed while a new photo is on its way, so the circle reads as
     "being replaced" rather than "unchanged" -- the button says the
     same thing in words, but this is where the eye already is. */
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
  transition: opacity 0.15s ease;
`;

// display:none rather than a clipped, focusable input: the <button>
// beside it is the real control, so this element never needs to take
// focus. It's only here because a click on a <button> can open the
// file dialogue and nothing else can.
const FileInput = styled.input`
  display: none;
`;

// The fix for the card's worst narrow-width behaviour. With
// `min-width: 0` this column would shrink to almost nothing rather
// than let the button wrap, so on a phone the name broke a word or two
// per line while the button sat comfortably beside it. A floor means
// the row runs out of room honestly and the button moves to its own
// line, which is what flex-wrap on Row was always there for.
const Identity = styled.div`
  flex: 1;
  min-width: 180px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
`;

const Name = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;

  @media (max-width: ${STACKED}) {
    font-size: 23px;
  }

  /* Long single names ("Nkemdirim") have nowhere to break, and one
     overflowing the card is worse than one that hyphenates. */
  overflow-wrap: anywhere;
`;

const Since = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[2]} 0 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
  flex-wrap: wrap;

  /* Once it has wrapped onto its own line, a 140px button left-aligned
     under the avatar reads like something that fell off the row. Full
     width makes it look chosen. Reaching for the element rather than
     Button's own block prop because whether it fills is a fact about
     this row's width, not about the button. */
  @media (max-width: ${STACKED}) {
    width: 100%;

    > button {
      width: 100%;
    }
  }
`;

export default {
  Row,
  Avatar,
  FileInput,
  Identity,
  NameRow,
  Name,
  Since,
  Actions,
};
