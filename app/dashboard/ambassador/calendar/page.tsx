"use client";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, DashboardNotice } from "../_components";
import { CalendarContent } from "./_calendar";

export default function AmbassadorCalendarPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();
  const hasDates = Boolean(data?.competition?.startDate);

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col">
        <title>Calendar - Ambassador Dashboard</title>
        <meta name="description" content="Key dates for the Bubba ambassador competition." />

        <div className="min-w-0">
          <h1 className="font-canela-display text-[28px] md:text-[38px] font-normal text-black leading-[1.1]">
            Important Dates
          </h1>
          <p className="mt-2.5 font-lato text-[14px] md:text-[15px] font-normal text-[#7f7f7f]">
            Key dates for the waitlist competition
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8">
            <DashboardNotice>Loading ambassador calendar...</DashboardNotice>
          </div>
        ) : null}
        {error ? (
          <div className="mt-8">
            <DashboardNotice>Unable to load ambassador calendar.</DashboardNotice>
          </div>
        ) : null}

        {hasDates ? <CalendarContent competition={data?.competition} /> : null}

        {!isLoading && !error && !hasDates ? (
          <div className="mt-8">
            <DashboardNotice>No calendar events yet.</DashboardNotice>
          </div>
        ) : null}
      </main>
    </AmbassadorGuard>
  );
}
