import type { Metadata } from "next";
import { Manrope, Unna } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl, getSiteOrigin } from "@/lib/siteUrl";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const unna = Unna({
  variable: "--font-unna",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteOrigin = getSiteOrigin();
const rootDescription =
  "Draw your fence layout, see the finished look, and get a clear material estimate. Free forever — no account required.";

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: {
    default: "Fence Planner & Material Calculator | Free",
    template: "%s | Fence Planner",
  },
  description: rootDescription,
  ...(siteOrigin
    ? {
        alternates: { canonical: "/" },
        openGraph: {
          title: "Fence Planner & Material Calculator",
          description: rootDescription,
          type: "website",
          url: absoluteUrl("/"),
          siteName: "Fence Planner",
        },
      }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${unna.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
