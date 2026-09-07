import { redirect } from "next/navigation";

/**
 * Waiting Room is hidden from the member side, so the route no longer renders
 * its page — stale links and bookmarks land on the home page instead of a
 * screen nobody is meant to see yet.
 *
 * Nothing was deleted: BubbaWaitingRoom and its six sections, their copy in
 * BUBBA_WAITING_ROOM_PAGE, and the .bb-page--waiting-room styles are all
 * intact. Restoring the page is reverting this file.
 */
export default function WaitingRoomPage() {
  redirect("/");
}
