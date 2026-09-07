"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";

import { BUBBA_COOKIE_NOTICE } from "@/lib/bubba-content";

const STORAGE_KEY = "bubba.cookie-consent";
const CONSENT_EXPIRY_DAYS = 180; // 6-month industry standard consent validity

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

/**
 * Bottom sheet shown according to industry standards:
 * - Only shown to visitors without valid, unexpired consent (180-day retention).
 * - Hidden automatically once consent (or custom preferences) are saved.
 * - Supports programmatic re-opening via the 'bubba:open-cookie-preferences' custom event.
 */
export function BubbaCookieBar() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // No consent recorded yet -> show notice
        setVisible(true);
      } else {
        try {
          const parsed = JSON.parse(stored) as Partial<CookiePreferences>;
          const timestamp = typeof parsed?.timestamp === "number" ? parsed.timestamp : 0;
          const isExpired =
            !timestamp || Date.now() - timestamp > CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

          if (isExpired) {
            // Consent expired -> re-prompt
            setVisible(true);
          } else {
            // Valid consent exists -> remain hidden and load preferences
            setVisible(false);
            if (typeof parsed.analytics === "boolean") setAnalytics(parsed.analytics);
            if (typeof parsed.marketing === "boolean") setMarketing(parsed.marketing);
          }
        } catch {
          setVisible(true);
        }
      }
    } catch {
      // Storage unavailable (e.g. strict private browsing)
      setVisible(true);
    }
  }, []);

  // Listen for custom trigger to re-open cookie preferences anytime (e.g. from footer)
  useEffect(() => {
    const handleOpen = () => {
      setShowPreferences(true);
      setVisible(true);
    };
    window.addEventListener("bubba:open-cookie-preferences", handleOpen);
    return () => {
      window.removeEventListener("bubba:open-cookie-preferences", handleOpen);
    };
  }, []);

  const saveConsent = (prefs: { analytics: boolean; marketing: boolean }) => {
    try {
      const data: CookiePreferences = {
        necessary: true,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable
    }
    setVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent({ analytics: true, marketing: true });
  };

  const handleSavePreferences = () => {
    saveConsent({ analytics, marketing });
  };

  const handleDismiss = () => {
    // Dismissing without explicit acceptance saves Essential Only (GDPR/ePrivacy standard)
    saveConsent({ analytics: false, marketing: false });
  };

  if (!visible) return null;

  return (
    <aside
      className={`bb-cookie ${showPreferences ? "bb-cookie--preferences" : ""}`}
      role="dialog"
      aria-label="Cookie notice"
      aria-live="polite"
    >
      <button
        type="button"
        className="bb-cookie-x"
        onClick={handleDismiss}
        aria-label="Dismiss cookie notice"
      >
        <X size={20} strokeWidth={1.8} />
      </button>

      {!showPreferences ? (
        <>
          <p className="bb-cookie-body">{BUBBA_COOKIE_NOTICE.body}</p>

          <button
            type="button"
            className="bb-cookie-prefs"
            onClick={() => setShowPreferences(true)}
          >
            {BUBBA_COOKIE_NOTICE.preferences}
          </button>

          <button
            type="button"
            className="bb-cookie-accept"
            onClick={handleAcceptAll}
          >
            {BUBBA_COOKIE_NOTICE.accept}
          </button>
        </>
      ) : (
        <div className="bb-cookie-prefs-panel">
          <div className="bb-cookie-prefs-top">
            <div className="bb-cookie-prefs-copy">
              <h3 className="bb-cookie-prefs-title">Cookie Preferences</h3>
              <p className="bb-cookie-prefs-intro">
                Manage your cookie choices. Essential cookies are required to make the website function properly.
              </p>
            </div>
            <div className="bb-cookie-prefs-policy">
              <Link href="/legal/cookies" onClick={handleDismiss}>
                Read Cookie Policy →
              </Link>
            </div>
          </div>

          <div className="bb-cookie-options">
            {/* 1. Essential */}
            <label className="bb-cookie-option bb-cookie-option--disabled">
              <div className="bb-cookie-option-check">
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Strictly Necessary Cookies (Always Active)"
                />
                <span className="bb-cookie-custom-check bb-cookie-custom-check--locked">
                  <Check size={13} strokeWidth={2.6} />
                </span>
              </div>
              <div className="bb-cookie-option-content">
                <div className="bb-cookie-option-header">
                  <span className="bb-cookie-option-title">Strictly Necessary</span>
                  <span className="bb-cookie-badge">Always Active</span>
                </div>
                <p className="bb-cookie-option-desc">
                  Essential for security, basic navigation, and account sessions.
                </p>
              </div>
            </label>

            {/* 2. Analytics */}
            <label className="bb-cookie-option">
              <div className="bb-cookie-option-check">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="Analytics and Performance Cookies"
                />
                <span className="bb-cookie-custom-check">
                  {analytics ? <Check size={13} strokeWidth={2.6} /> : null}
                </span>
              </div>
              <div className="bb-cookie-option-content">
                <div className="bb-cookie-option-header">
                  <span className="bb-cookie-option-title">Analytics & Performance</span>
                </div>
                <p className="bb-cookie-option-desc">
                  Helps us understand how visitors use the site to improve features and speed.
                </p>
              </div>
            </label>

            {/* 3. Marketing */}
            <label className="bb-cookie-option">
              <div className="bb-cookie-option-check">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  aria-label="Marketing and Personalization Cookies"
                />
                <span className="bb-cookie-custom-check">
                  {marketing ? <Check size={13} strokeWidth={2.6} /> : null}
                </span>
              </div>
              <div className="bb-cookie-option-content">
                <div className="bb-cookie-option-header">
                  <span className="bb-cookie-option-title">Marketing & Personalization</span>
                </div>
                <p className="bb-cookie-option-desc">
                  Allows us to personalize promotions and measure advertising effectiveness.
                </p>
              </div>
            </label>
          </div>

          <div className="bb-cookie-prefs-actions">
            <button
              type="button"
              className="bb-cookie-accept"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
            <button
              type="button"
              className="bb-cookie-btn-secondary"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
