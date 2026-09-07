"use client";

import { useEffect, useState } from "react";

import { BUBBA_BRAND } from "@/lib/bubba-content";

const INITIAL_SECONDS = 23 * 3600 + 59 * 60; // 23:59:00
const RADIUS = 48.9;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts down from 23:59:00 whenever the page is refreshed,
 * ticking every second.
 */
export function BubbaDial() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;

  return (
    <div className="bb-dial">
      <svg className="bb-dial-svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="bb-dial-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ADC3A5" stopOpacity="1" />
            <stop offset="47%" stopColor="#6F8670" stopOpacity="1" />
            <stop offset="100%" stopColor="#2C4433" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          className="bb-dial-track"
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="url(#bb-dial-grad)"
        />
        {/* Elapsed arc and the handle that rides its leading edge.
            Angles are measured from 12 o'clock: the reference runs the dark
            cap from -2deg to +14deg and centres the handle on the ring at
            +14deg, where it covers the arc's end. Endpoints are
            (50 + r*sin, 50 - r*cos) with r = 48.9. */}
        <path
          d="M 48.29,1.13 A 48.9,48.9 0 0,1 61.83,2.55"
          fill="none"
          stroke="#000"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* The handle. Kept out of the <svg> above because that element clips to
          its viewBox and the stud overhangs the ring; .bb-dial-stud places and
          rotates it onto the arc's leading edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bb-dial-stud" src="/images/timer_stud.png" alt="" aria-hidden="true" />

      <div className="bb-dial-inner">
        <div className="bb-dial-readout" suppressHydrationWarning>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(h)}</span>
            <span className="bb-dial-unit">HRS</span>
          </div>
          <span className="bb-dial-colon" aria-hidden="true">:</span>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(m)}</span>
            <span className="bb-dial-unit">MIN</span>
          </div>
          <span className="bb-dial-colon" aria-hidden="true">:</span>
          <div className="bb-dial-group">
            <span className="bb-dial-time">{pad(s)}</span>
            <span className="bb-dial-unit">SEC</span>
          </div>
        </div>
        <span className="bb-sr">
          {h} hours, {m} minutes and {s} seconds left today
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/*<img src={BUBBA_BRAND.bolt} alt="" className="bb-dial-bolt" />*/}
        <svg width="28" height="42" className="bb-dial-bolt" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.44551 41.87C9.28551 41.87 9.11545 41.84 8.95545 41.77C8.40545 41.53 8.1055 40.9301 8.2555 40.3501L12.4055 23.65H1.22547C0.825474 23.65 0.445464 23.45 0.215464 23.12C-0.0145362 22.79 -0.0645411 22.36 0.0854589 21.98L8.28547 0.780029C8.46547 0.310029 8.92549 0 9.42549 0H20.7055C21.1155 0 21.5055 0.210059 21.7355 0.560059C21.9655 0.910059 21.9955 1.35009 21.8355 1.72009L16.9755 12.74H26.5754C27.0254 12.74 27.4355 12.98 27.6555 13.38C27.8755 13.78 27.8555 14.25 27.6155 14.63L10.4855 41.3101C10.2555 41.6701 9.85545 41.87 9.45545 41.87H9.44551Z" fill="#294431"/>
        </svg>

      </div>
    </div>
  );
}
