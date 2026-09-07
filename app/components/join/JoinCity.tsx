"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useListAllMarketsQuery } from "@/features/api/apiSlice";
import {
  clearWaitlistErrors,
  joinWaitlist,
  updateWaitlistForm,
} from "@/features/waitlist/waitlist.slice";
import { isAlreadyOnWaitlistError } from "@/lib/waitlist-errors";
import { cityArt, featuredCityRank } from "@/lib/join";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinAlreadyOnWaitlistModal } from "./JoinAlreadyOnWaitlistModal";
import { JoinFail } from "./JoinFail";
import { JoinShell } from "./JoinShell";

/** "Boston" + "MA" reads as "Boston, MA" beneath the name in the dropdown. */
function where(city: string | null, state: string | null) {
  return [city, state].filter(Boolean).join(", ") || null;
}
export function JoinCity() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { form, joinStatus, joinError } = useAppSelector((s) => s.waitlist);
  const alreadyOnWaitlist = isAlreadyOnWaitlistError(joinError);
  const inlineError = alreadyOnWaitlist ? null : joinError;
  const railRef = useRef<HTMLUListElement>(null);

  /* Public API is GET /markets/all, so the search filters in memory — no
     per-keystroke request, and the card rail stays put while it narrows. */
  const {
    data: allMarkets,
    isLoading,
    isError: featuredFailed,
    refetch: refetchFeatured,
  } = useListAllMarketsQuery();
  const markets = allMarkets ?? [];
  const cards = [...markets]
    .sort((a, b) => featuredCityRank(a.name) - featuredCityRank(b.name))
    .slice(0, 10);

  /* The rail only overflows when the cards outrun the track. Since the step
     content went full width on desktop, five markets fit without scrolling —
     and an always-rendered arrow just sat in empty space to their right. */
  const [canScrollRail, setCanScrollRail] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () =>
      setCanScrollRail(rail.scrollWidth - rail.clientWidth > 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [cards.length, isLoading]);

  const scrollRail = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".jn-city");
    const step = card ? card.getBoundingClientRect().width + 12 : 160;
    const max = rail.scrollWidth - rail.clientWidth;
    if (dir > 0 && rail.scrollLeft >= max - 8) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };


  const choose = (id: string, name: string, place: string | null) => {
    dispatch(
      updateWaitlistForm({
        marketId: id,
        marketName: name,
        marketPlace: place,
        skippedMarket: false,
        schoolId: null,
        schoolName: null,
        notInSchool: false,
      }),
    );

  };


  return (
    <>
      {/* Submission moved here with the last-step role, so the duplicate-email
          dialog moves with it. */}
      {alreadyOnWaitlist ? (
        <JoinAlreadyOnWaitlistModal onClose={() => dispatch(clearWaitlistErrors())} />
      ) : null}

      <JoinShell
      slug="city"
      canContinue
      busy={joinStatus === "loading"}
      error={inlineError}
      /* City is the last collecting step now that campus and ambassador are
         out of the flow, so this is where the form is submitted. Continue
         waits on the request rather than navigating optimistically. */
      onContinue={() => {
        if (!form.marketId) {
          dispatch(
            updateWaitlistForm({
              marketId: null,
              marketName: null,
              marketPlace: null,
              skippedMarket: true,
              schoolId: null,
              schoolName: null,
              notInSchool: false,
            }),
          );
        }

        void dispatch(joinWaitlist())
          .unwrap()
          .then(() => router.push("/waitlist/done"))
          .catch(() => {
            /* joinError is already in the store; the shell renders it. */
          });

        return false;
      }}
    >
      {featuredFailed ? (
        <JoinFail what="cities" onRetry={() => void refetchFeatured()} />
      ) : null}

      <p className="jn-rail-label">Choose your launch city</p>

      <div className="jn-cities-wrap">
        <ul
          ref={railRef}
          className="jn-cities"
          aria-label="Launch cities"
          aria-busy={isLoading || undefined}
        >
          {isLoading
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <li key={i} className="jn-city jn-city--ghost" aria-hidden="true" />
              ))
            : cards.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={
                      "jn-city" + (form.marketId === m.id ? " jn-city--on" : "")
                    }
                    onClick={() => choose(m.id, m.name, where(m.city, m.state))}
                    aria-pressed={form.marketId === m.id}
                  >
                    <span className="jn-city-art" aria-hidden="true">
                      {cityArt(m.name) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cityArt(m.name) as string} alt="" />
                      ) : null}
                    </span>
                    <span className="jn-city-name">{m.name}</span>
                  </button>
                </li>
              ))}
        </ul>
        {canScrollRail ? (
          <button
            type="button"
            className="jn-cities-nav"
            onClick={() => scrollRail(1)}
            aria-label="Next cities"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        ) : null}
      </div>

      {/* Two lines in the artboard: the question, then the reassurance under
          it — not one wrapped paragraph. */}
      <p className="jn-city-hint">
        <strong className="jn-city-hint-q">Don&rsquo;t see your city?</strong>
        <span className="jn-city-hint-a">
          Just continue — we&rsquo;ll let you know when Bubba launches near you.
        </span>
      </p>
      {/* No confirmation chip in the artboards — the chosen city is shown by
          the card itself taking the selected state, and tapping another card
          moves the selection. */}

      </JoinShell>
    </>
  );
}
