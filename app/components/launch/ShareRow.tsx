"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Instagram, MessageCircle, Share } from "lucide-react";

import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { SHARE_MESSAGE } from "@/lib/launch";

type ShareRowProps = {
  /** The referral link to share. Buttons stay disabled until this resolves. */
  link: string | null;
};

type ActionId = "instagram" | "messages" | "whatsapp" | "more";

function WhatsappGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 20.5l1.3-3.8A8.3 8.3 0 1 1 7.9 19.4l-4.4 1.1z" />
      <path d="M9.2 8.4c.3 1.5 1 2.9 2.1 3.9a8.5 8.5 0 0 0 3.4 2l1-1.3 1.7 1-.5 1.5c-1.3.2-2.6-.1-3.7-.8a10 10 0 0 1-4.3-4.3 4.6 4.6 0 0 1-.8-3.7l1.5-.5 1 1.7z" />
    </svg>
  );
}

export function ShareRow({ link }: ShareRowProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [done, setDone] = useState<ActionId | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // navigator.share is unavailable on most desktop browsers, so this is checked
  // after mount rather than assumed — and never during SSR.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = (id: ActionId | null, message: string) => {
    setDone(id);
    setStatus(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDone(null);
      setStatus(null);
    }, 2500);
  };

  const shareText = link ? `${SHARE_MESSAGE} ${link}` : "";

  const handleCopy = async (id: ActionId, successMessage: string) => {
    if (!link) return;
    const ok = await copyToClipboard(link);
    flash(ok ? id : null, ok ? successMessage : "Couldn't copy — select the link above and copy it manually.");
    return ok;
  };

  const handleInstagram = async () => {
    // Instagram has no web intent for sharing an arbitrary URL, so the honest
    // flow is: put the link on the clipboard, then open Instagram to paste it.
    const ok = await handleCopy("instagram", "Link copied — paste it into your story or bio.");
    if (ok) window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleMessages = () => {
    if (!link) return;
    // sms: opens the native messaging app on mobile; harmless no-op elsewhere.
    window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`;
  };

  const handleWhatsapp = () => {
    if (!link) return;
    // wa.me hands off to the installed app on mobile and to WhatsApp Web on
    // desktop, so one URL covers both.
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const handleMore = async () => {
    if (!link) return;
    if (canNativeShare) {
      try {
        await navigator.share({ title: "Join me on Bubba", text: SHARE_MESSAGE, url: link });
      } catch {
        // The user dismissing the sheet rejects the promise — not an error.
      }
      return;
    }
    await handleCopy("more", "Link copied to your clipboard.");
  };

  const actions: { id: ActionId; label: string; caption: string; icon: React.ReactNode; onClick: () => void }[] = [
    {
      id: "instagram",
      label: "Share on Instagram",
      caption: "Instagram",
      icon: <Instagram size={22} strokeWidth={1.7} />,
      onClick: handleInstagram,
    },
    {
      id: "messages",
      label: "Share via Messages",
      caption: "Messages",
      icon: <MessageCircle size={22} strokeWidth={1.7} />,
      onClick: handleMessages,
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      caption: "Whatsapp",
      icon: <WhatsappGlyph />,
      onClick: handleWhatsapp,
    },
    {
      id: "more",
      label: canNativeShare ? "More sharing options" : "Copy link",
      caption: "Share link",
      icon: <Share size={22} strokeWidth={1.7} />,
      onClick: handleMore,
    },
  ];

  return (
    <>
      <div className="launch-share-row">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="launch-share-item"
            onClick={action.onClick}
            disabled={!link}
            aria-label={action.label}
            title={action.label}
          >
            <span className="launch-share-icon">
              {done === action.id ? <Check size={22} strokeWidth={2} /> : action.icon}
            </span>
            <span className="launch-share-caption">{action.caption}</span>
          </button>
        ))}
      </div>

      <p className="launch-share-status" role="status" aria-live="polite">
        {status}
      </p>
    </>
  );
}
