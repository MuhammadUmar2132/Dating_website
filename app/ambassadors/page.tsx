import type { Metadata } from "next";

import { AmbassadorsPage as AmbassadorsScreen } from "@/app/components/bubba/AmbassadorsPage";

import "@/styles/bubba.css";
import "@/styles/ambassadors.css";

export const metadata: Metadata = {
  title: "Ambassadors — 24",
  description:
    "Lead the campus launch. Invite friends to join 24 and unlock prizes before launch.",
};

export default function AmbassadorsRoute() {
  return <AmbassadorsScreen />;
}
