"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useGetMyPointsHistoryQuery } from "@/features/api/apiSlice";
import type { PointsHistoryEntry } from "@/lib/api/rewards.types";

const INITIAL_VISIBLE = 10;
const LOAD_MORE_COUNT = 8;
/* The API caps a page at 100 rows. */
const MAX_VISIBLE = 100;

/* Ledger rows carry a category and a source type, not display copy - this turns
   them into the labels the page shows. */
const ENTRY_LABELS: Record<string, { title: string; subtitle: string; icon: string }> = {
  invite: {
    title: "Friend joined via your link",
    subtitle: "Invite friends",
    icon: "/images/assets/invites.png",
  },
  prompt: {
    title: "Answered daily prompt",
    subtitle: "Daily prompt",
    icon: "/images/assets/points_earned.png",
  },
  like: {
    title: "Gave a like",
    subtitle: "Community engagement",
    icon: "/images/assets/heart.png",
  },
  comment: {
    title: "Wrote a comment",
    subtitle: "Community engagement",
    icon: "/images/assets/message.png",
  },
  winner_bonus: {
    title: "Prompt winner bonus",
    subtitle: "Daily prompt",
    icon: "/images/assets/trophy.png",
  },
  admin_adjustment: {
    title: "Points adjustment",
    subtitle: "Bea team",
    icon: "/images/assets/reward.png",
  },
  order_purchase: {
    title: "Shop purchase",
    subtitle: "Shop",
    icon: "/images/assets/reward.png",
  },
  order_refund: {
    title: "Order refunded",
    subtitle: "Shop",
    icon: "/images/assets/reward.png",
  },
};

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function describe(entry: PointsHistoryEntry) {
  const key = entry.pointCategory ?? entry.sourceType;
  return (
    ENTRY_LABELS[key] ??
    ENTRY_LABELS[entry.sourceType] ?? {
      title: titleCase(key || "Points"),
      subtitle: titleCase(entry.sourceType || ""),
      icon: "/images/assets/points_earned.png",
    }
  );
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function HistoryRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200/40 animate-pulse">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-full bg-neutral-200/60 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-neutral-200/50 rounded" />
          <div className="h-3 w-28 bg-neutral-200/40 rounded" />
        </div>
      </div>
      <div className="h-5 w-12 bg-neutral-200/50 rounded shrink-0" />
    </div>
  );
}

function HistoryRow({ entry }: { entry: PointsHistoryEntry }) {
  const { title, subtitle, icon } = describe(entry);
  const isEarn = entry.points >= 0;

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200/40 last:border-0 hover:bg-neutral-50/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-full bg-[#faf0eb] border border-neutral-100 flex items-center justify-center shrink-0">
          <div className="relative w-4 h-4">
            <Image src={icon} alt="" fill className="object-contain" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[13px] md:text-[15px] font-bold text-neutral-900 leading-tight truncate">
            {title}
          </p>
          <p className="font-sans text-[11px] md:text-[13px] font-medium text-neutral-500 mt-0.5">
            {subtitle ? `${subtitle} · ` : ""}
            {timeAgo(entry.createdAt)}
          </p>
        </div>
      </div>
      <span
        className={`font-minionvariable font-bold text-[16px] md:text-[20px] leading-none shrink-0 ${
          isEarn ? "text-[#3b9347]" : "text-[#d05038]"
        }`}
      >
        {isEarn ? "+" : "-"}
        {Math.abs(entry.points).toLocaleString()}
      </span>
    </div>
  );
}

export default function PointsHistorySection() {
  /* Rather than stitching pages together client-side, the page just asks for a
     longer first page as the reader scrolls - the list stays consistent and
     there is no accumulated state to fall out of sync with the ledger. */
  const [limit, setLimit] = useState(INITIAL_VISIBLE);
  const { data, isLoading, isFetching } = useGetMyPointsHistoryQuery({ page: 1, limit });
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const entries = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const balance = data?.balance ?? 0;
  const hasMoreToLoad = entries.length < total && limit < MAX_VISIBLE;

  useEffect(() => {
    if (!hasMoreToLoad) return;

    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (observed) => {
        if (!observed[0]?.isIntersecting || isFetching) return;
        setLimit((prev) => Math.min(prev + LOAD_MORE_COUNT, MAX_VISIBLE));
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreToLoad, isFetching]);

  return (
    <section className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/invite"
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
          aria-label="Back to invite friends"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Points history
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Every point you&apos;ve earned and redeemed
          </p>
        </div>
      </div>

      <div className="bg-[#f4f0ec] border border-[#e3ded6] rounded-[12px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-sfpro text-[12px] md:text-[14px] font-medium tracking-[0.05em] text-[#3D2C24] uppercase">
              Current balance
            </p>
            <p className="font-minionvariable text-[28px] md:text-[40px] font-bold text-neutral-900 leading-none mt-1">
              {isLoading ? "--" : balance.toLocaleString()}
            </p>
            <p className="font-sans text-[12px] md:text-[14px] font-medium text-neutral-500 mt-1">
              points available
            </p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#faf0eb] border border-neutral-100 flex items-center justify-center shrink-0">
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <Image src="/images/assets/reward.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#fdfcfb] border border-[#f8f1eb] rounded-[12px] p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] w-full">
        <h2 className="font-sans text-[12px] font-bold text-black uppercase tracking-wider mb-1">
          All transactions
        </h2>
        <p className="font-sans text-[11px] md:text-[13px] font-medium text-neutral-500 mb-2">
          Sorted by most recent
        </p>

        <div className="flex flex-col">
          {isLoading ? (
            <>
              <HistoryRowSkeleton />
              <HistoryRowSkeleton />
              <HistoryRowSkeleton />
            </>
          ) : entries.length ? (
            entries.map((entry) => <HistoryRow key={entry.id} entry={entry} />)
          ) : (
            <p className="font-sans text-[13px] font-medium text-neutral-500 py-6">
              No points activity yet. Invite a friend or answer today&apos;s prompt to get started.
            </p>
          )}

          {!isLoading && isFetching && <HistoryRowSkeleton />}
        </div>

        {hasMoreToLoad && <div ref={loadMoreRef} className="h-1" aria-hidden />}
      </div>
    </section>
  );
}
