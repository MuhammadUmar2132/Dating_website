/**
 * Press Room content configuration
 */

export const PRESS_ROOM_NAV_LINKS = [
  { href: "/press-room/about", label: "About" },
  { href: "/press-room/news", label: "News" },
  { href: "/press-room/assets", label: "Assets" },
  { href: "/press-room/press", label: "Press" },
] as const;

export const PRESS_ROOM_ASSETS = {
  logo: "/bubba/bubba-logo@4x.png",
  bLogo: "/bubba/b-logo@4x.png",
  bLogoGreen: "/bubba/b-logo-green@4x.png",
  titleAboutBubba: "/bubba/title-about-bubba@4x.png",
  titleNews: "/bubba/title-news@4x.png",
  titleAssets: "/bubba/title-assets@4x.png",
  titlePress: "/bubba/title-press@4x.png",
} as const;

export const PRESS_ROOM_COLORS = {
  darkGreen: "#1a4336",
  divider: "#cccecd",
  textGray: "#6b7280",
  /** The masthead sits on white; the content below it on a light grey wash. */
  headerBg: "#ffffff",
  pageBg: "#f6f6f5",
} as const;

export const PRESS_ROOM_ABOUT_TEXT =
  "Bubba is a dating app designed for the moment. Launched in 2026, " +
  "Bubba set out to make dating just a little bit more fun, and fast. We " +
  "set a 24 hour timer to chat, designed to get people meeting same-day. " +
  "Our members build their profile with a variety of icebreakers and can " +
  "discover other users through a traditional feed, customary to dating " +
  "apps, or in a scene, an activity-driven matchmaking feataure. Our " +
  "mission is to nurture an exciting environment that enables people to " +
  "make the most of any given day.";

export const PRESS_ROOM_CONTACT_EMAIL = "press@joinbubba.com";

export const PRESS_ROOM_TAGLINE = "Together, today.";
