"use client";

import { useGetAmbassadorReferralsQuery } from "@/features/api/apiSlice";
import type { AmbassadorNetworkNode, AmbassadorReferralNetwork } from "@/lib/api/ambassador.types";
import { AmbassadorGuard, DashboardNotice, MetricCard, Panel, StatusPill } from "../_components";

function asReferralNetwork(data: unknown): AmbassadorReferralNetwork | null {
  if (!data) return null;
  if (!Array.isArray(data) && typeof data === "object" && data && "totals" in data) {
    return data as AmbassadorReferralNetwork;
  }

  const raw = Array.isArray(data) ? data : [];
  const nodes: AmbassadorNetworkNode[] = raw.map((row) => ({
    id: row.id,
    fullName: row.fullName ?? "Anonymous",
    maskedEmail: row.maskedEmail ?? null,
    referralDepth: row.referralDepth ?? 1,
    referredByUserId: row.referredByUserId ?? "",
    referrerName: row.referrerName ?? "",
    status: row.status ?? "COUNTED",
    isPending: false,
    isCompleted: true,
    joinedAt: row.joinedAt ?? row.createdAt ?? "",
    countedAt: row.countedAt ?? row.createdAt ?? null,
  }));
  const directReferrals = nodes.filter((node) => node.referralDepth <= 1);
  const downstreamNetwork = nodes.filter((node) => node.referralDepth > 1);
  return {
    directReferrals,
    downstreamNetwork,
    depthTotals: [],
    totals: {
      direct: directReferrals.length,
      directCompleted: directReferrals.length,
      directPending: 0,
      total: nodes.length,
      completed: nodes.length,
      pending: 0,
    },
  };
}

export default function AmbassadorNetworkPage() {
  const { data, isLoading, error } = useGetAmbassadorReferralsQuery();
  const network = asReferralNetwork(data);

  return (
    <AmbassadorGuard>
      <main className="flex-1 min-w-0 flex flex-col gap-5 md:gap-6">
        <title>Network - Ambassador Dashboard</title>
        <meta name="description" content="Your direct referrals and full downstream referral network." />

        <div className="min-w-0">
          <h1 className="font-canela-display text-[24px] md:text-[30px] font-normal text-black leading-[1.1]">
            Referral Network
          </h1>
          <p className="mt-2 font-lato text-[13px] md:text-[14px] font-normal text-[#7c7c7c]">
            Review your direct referrals and full downstream network. Pending referrals are visible but excluded from ranking until verified.
          </p>
        </div>

        {isLoading ? <DashboardNotice>Loading referral network...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load the ambassador referral network.</DashboardNotice> : null}

        {network ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Direct Referrals" value={network.totals.directCompleted} note={`${network.totals.directPending} pending`} />
              <MetricCard label="Completed Network" value={network.totals.completed} note="Counts toward ranking" />
              <MetricCard label="Pending Network" value={network.totals.pending} note="Excluded until verified" />
              <MetricCard label="Total Visible" value={network.totals.total} note="Completed plus pending" />
            </div>

            <Panel title="Depth Totals">
              <div className="grid md:grid-cols-3 gap-3">
                {network.depthTotals.length ? network.depthTotals.map((row) => (
                  <div key={row.depth} className="rounded-[8px] border border-neutral-200/70 bg-white p-3.5">
                    <p className="font-sfpro text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">Depth {row.depth}</p>
                    <p className="mt-1.5 font-minionvariable text-[18px] font-bold text-neutral-900">{row.completed}</p>
                    <p className="font-lato text-[11px] font-semibold text-neutral-400">{row.pending} pending / {row.total} total</p>
                  </div>
                )) : <p className="font-lato text-[13px] font-semibold text-neutral-500">No depth totals yet.</p>}
              </div>
            </Panel>

            <Panel title="Direct Referrals">
              <ReferralRows rows={network.directReferrals} />
            </Panel>

            <Panel title="Full Downstream Network">
              <ReferralRows rows={network.downstreamNetwork} showReferrer />
            </Panel>
          </>
        ) : null}
      </main>
    </AmbassadorGuard>
  );
}

function ReferralRows({
  rows,
  showReferrer = false,
}: {
  rows: AmbassadorNetworkNode[];
  showReferrer?: boolean;
}) {
  if (!rows.length) {
    return <p className="font-lato text-[13px] font-semibold text-neutral-500">No referrals yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[620px] divide-y divide-neutral-200/70">
        <div className="grid grid-cols-[1.3fr_1.2fr_72px_92px_1fr] gap-3 pb-2.5 font-sfpro text-[10px] font-bold uppercase tracking-[0.1em] text-[#402b23]">
          <span>Name</span>
          <span>Email</span>
          <span>Depth</span>
          <span>Status</span>
          <span>{showReferrer ? "Referrer" : "Joined"}</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1.3fr_1.2fr_72px_92px_1fr] gap-3 py-2.5 items-center">
            <span className="font-lato text-[13px] font-bold text-neutral-900 truncate">{row.fullName}</span>
            <span className="font-lato text-[12px] font-semibold text-neutral-500 truncate">{row.maskedEmail ?? "Hidden"}</span>
            <span className="font-minionvariable text-[13px] font-bold text-neutral-800">{row.referralDepth}</span>
            <StatusPill status={row.status} />
            <span className="font-lato text-[12px] font-semibold text-neutral-500 truncate">
              {showReferrer ? row.referrerName : new Date(row.joinedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
