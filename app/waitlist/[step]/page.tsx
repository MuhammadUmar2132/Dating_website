import { notFound } from "next/navigation";

import { JoinAmbassador } from "@/app/components/join/JoinAmbassador";
import { JoinBasics } from "@/app/components/join/JoinBasics";
import { JoinCampus } from "@/app/components/join/JoinCampus";
import { JoinCity } from "@/app/components/join/JoinCity";
import { JoinEmail } from "@/app/components/join/JoinEmail";
import { JOIN_STEPS, type JoinStepSlug } from "@/lib/join";

import "@/styles/join.css";

type Props = { params: Promise<{ step: string }> };

export function generateStaticParams() {
  return JOIN_STEPS.map((s) => ({ step: s.slug }));
}

const SCREENS: Record<JoinStepSlug, () => React.ReactElement | null> = {
  city: JoinCity,
  campus: JoinCampus,
  ambassador: JoinAmbassador,
  basics: JoinBasics,
  email: JoinEmail,
};

export default async function JoinStepPage({ params }: Props) {
  const { step } = await params;
  /* Steps taken out of the flow keep their component, so re-adding them is a
     one-line change — but they are not reachable by URL while they are out. */
  const inFlow = JOIN_STEPS.some((s) => s.slug === step);
  const Screen = SCREENS[step as JoinStepSlug];
  if (!Screen || !inFlow) notFound();
  return <Screen />;
}
