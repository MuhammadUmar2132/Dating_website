import { BubbaShell } from "./BubbaShell";
import { BubbaWaitingRoomCampusPrize } from "./waiting-room/BubbaWaitingRoomCampusPrize";
import { BubbaWaitingRoomDates } from "./waiting-room/BubbaWaitingRoomDates";
import { BubbaWaitingRoomHero } from "./waiting-room/BubbaWaitingRoomHero";
import { BubbaWaitingRoomHowItWorks } from "./waiting-room/BubbaWaitingRoomHowItWorks";
import { BubbaWaitingRoomOverview } from "./waiting-room/BubbaWaitingRoomOverview";
import { BubbaWaitingRoomSneakPeek } from "./waiting-room/BubbaWaitingRoomSneakPeek";

type Props = {
  pageClassName?: string;
};

export function BubbaWaitingRoom({ pageClassName }: Props) {
  return (
    // The route still exists, but Waiting Room is no longer a nav item, so
    // there is nothing for the header to mark as current.
    <BubbaShell pageClassName={pageClassName} showCapture={false}>
      <BubbaWaitingRoomHero />
      <BubbaWaitingRoomOverview />
      <BubbaWaitingRoomDates />
      <BubbaWaitingRoomCampusPrize />
      <BubbaWaitingRoomHowItWorks />
      <BubbaWaitingRoomSneakPeek />
    </BubbaShell>
  );
}
