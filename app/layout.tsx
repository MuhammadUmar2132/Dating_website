import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";

import { StoreProvider } from "@/store/provider";
import { caveat, dmSerifDisplay, fraunces, inter } from "@/lib/fonts";

import "./globals.css";

// Google Fonts only serves Lato at 100/300/400/700/900. The Illustrator
// sources also use Lato-Medium (500) and Lato-Semibold (600), which come from
// the wider retail family — those two are registered as self-hosted @font-face
// rules in styles/bubba-fonts.css instead.
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-sans",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Bea Website",
  description: "Together, today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning on <html> and <body> only:
  //
  // Browser extensions inject attributes into these two elements before React
  // hydrates, which React then reports as a server/client mismatch even though
  // nothing in this app rendered them. ColorZilla adds cz-shortcut-listen to
  // <body>; Grammarly adds data-gr-ext-installed and
  // data-new-gr-c-s-check-loaded; Dark Reader and password managers do the same
  // on <html>. None of it is fixable from application code — the markup is
  // altered outside React's control.
  //
  // This is deliberately narrow. suppressHydrationWarning applies only to the
  // element it is set on (its attributes and direct text), NOT to descendants,
  // so genuine hydration bugs anywhere inside the tree are still reported.
  // Do not spread it onto other elements to quiet a warning — for those, fix
  // the underlying server/client divergence instead.
  return (
    <html
      lang="en"
      className={`${lato.variable} ${inter.variable} ${fraunces.variable} ${serifFont.variable} ${caveat.variable} ${dmSerifDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}