"use client";

import { useState } from "react";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, DashboardNotice } from "./_components";
import { useNow } from "./_hub";
import { AmbassadorOverviewContent } from "./_overview";

export default function AmbassadorOverviewPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();
  const now = useNow();
  const [copied, setCopied] = useState(false);

  const referralLink = data?.user.referralLink ?? "";

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked - the link stays selectable on screen */
    }
  };

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col gap-4 md:gap-5">
        <title>Overview - Ambassador Dashboard</title>
        <meta
          name="description"
          content="Track your ambassador link, referral impact, competition standing, and recent activity."
        />

        {isLoading ? <DashboardNotice>Loading ambassador overview...</DashboardNotice> : null}
        {error ? <DashboardNotice>Ambassador dashboard is unavailable for this account.</DashboardNotice> : null}

        {data ? (
          <AmbassadorOverviewContent data={data} now={now} copied={copied} onCopy={handleCopy} />
        ) : null}
      </main>
    </AmbassadorGuard>
  );
}
