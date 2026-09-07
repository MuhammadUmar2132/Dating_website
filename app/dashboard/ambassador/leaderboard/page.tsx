"use client";

import { useGetAmbassadorDashboardQuery, useGetAmbassadorLeaderboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, DashboardNotice } from "../_components";
import { LeaderboardContent } from "./_leaderboard";

export default function AmbassadorLeaderboardPage() {
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useGetAmbassadorDashboardQuery();
  const { data: remote = [], isLoading, error } = useGetAmbassadorLeaderboardQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col gap-5 md:gap-6">
        <title>Leaderboard - Ambassador Dashboard</title>
        <meta name="description" content="Ambassador ranking based on verified referral-network performance." />

        {isLoading || dashboardLoading ? <DashboardNotice>Loading ambassador leaderboard...</DashboardNotice> : null}
        {error || dashboardError ? <DashboardNotice>Unable to load ambassador leaderboard.</DashboardNotice> : null}

        <LeaderboardContent dashboard={dashboard} remote={remote} />
      </main>
    </AmbassadorGuard>
  );
}
