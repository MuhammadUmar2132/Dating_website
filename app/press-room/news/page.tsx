"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { PRESS_ROOM_COLORS, PRESS_ROOM_ASSETS } from "@/lib/press-room-content";

type NewsPost = {
  id: number;
  title: string;
  description: string;
  date: string;
};

/* Search and the period filter share one control style; the row is capped so
   the fields stay 372px rather than stretching the full content column. */
const FIELD =
  "h-[48px] md:h-[52px] px-4 md:px-5 bg-[#eeeeec] rounded-[8px] text-[15px] md:text-[16px] font-lato font-normal text-black placeholder:text-[#9a9a97] focus:outline-none focus:ring-2 focus:ring-gray-300";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");

  const posts: NewsPost[] = [
    {
      id: 1,
      title: "Title of post would go here",
      description: "Description of the post would go here",
      date: "June 12, 2026",
    },
  ];

  return (
    <div className="w-full">
      {/* No About band — the reference runs the grey wash to the foot. */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[72px] pt-10 md:pt-20 pb-16 md:pb-24 min-h-[calc(100vh-200px)]">
        <div className="mb-6 md:mb-8">
          <Image
            src={PRESS_ROOM_ASSETS.titleNews}
            alt="News"
            width={305}
            height={93}
            className="h-[38px] md:h-[56px] w-auto"
            priority
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 md:mb-16 max-w-[860px]">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${FIELD} w-full sm:flex-1 sm:max-w-[372px]`}
            aria-label="Search news"
          />

          <div className="relative w-full sm:flex-1 sm:max-w-[372px]">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`${FIELD} w-full appearance-none pr-12 cursor-pointer`}
              aria-label="Filter by time period"
            >
              <option>All Time</option>
              <option>Past Week</option>
              <option>Past Month</option>
              <option>Past Year</option>
            </select>
            <ChevronsUpDown
              size={18}
              strokeWidth={2}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-black"
              aria-hidden="true"
            />
          </div>

          <button
            type="button"
            className="h-[48px] md:h-[52px] w-full sm:w-[84px] shrink-0 text-white rounded-[8px] hover:opacity-90 transition-opacity flex items-center justify-center"
            style={{ backgroundColor: PRESS_ROOM_COLORS.darkGreen }}
            aria-label="Submit search"
          >
            <svg
              width="40"
              height="16"
              viewBox="0 0 40 16"
              fill="none"
              className="w-[26px] md:w-[30px] h-auto"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0 8H38M38 8L31 1M38 8L31 15"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* News Posts */}
        <div className="space-y-12 md:space-y-16">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-5 lg:gap-10 items-start"
            >
              <div className="w-full lg:w-[390px] aspect-[490/455] bg-black rounded-[14px]" />

              <div className="lg:pt-[42px]">
                <h2 className="text-[19px] md:text-[22px] mb-2 md:mb-3 font-lato font-bold leading-tight">
                  {post.title}
                </h2>
                <p className="text-[14px] text-black mb-2 md:mb-3 font-lato font-normal">
                  {post.description}
                </p>
                <p className="text-[14px] text-gray-500 font-lato font-normal">
                  {post.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
