"use client";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard } from "../_components";
import { PrizesContent } from "./_prizes";

export default function AmbassadorPrizesPage() {
  const { data } = useGetAmbassadorDashboardQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col gap-6 md:gap-7">
        <title>Prizes - Ambassador Dashboard</title>
        <meta
          name="description"
          content="Cash and merch prizes for top Bubba ambassadors at the national, market, and campus level."
        />
        {/* Milestones are measured against personal invites, not network reach. */}
        <PrizesContent invites={data?.overview.directInvites ?? 0} />
      </main>
    </AmbassadorGuard>
  );
}
