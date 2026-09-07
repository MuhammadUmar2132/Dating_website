"use client";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard } from "../_components";
import { RulesContent, periodLabel } from "./_rules";

export default function AmbassadorRulesPage() {
  const { data } = useGetAmbassadorDashboardQuery();

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col">
        <RulesContent period={periodLabel(data?.competition?.startDate, data?.competition?.endDate)} />
      </main>
    </AmbassadorGuard>
  );
}
