import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { OpenKLogo } from "@/components/openk_logo";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site_footer";
import { env } from "@/lib/env";

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_DESC =
  "OpenK Research studies the shape of market uncertainty: forward distributions, options-implied distributions, and the market's evolving long-run reference.";
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: "OpenK Research | Uncertainty has shape", template: "%s | OpenK Research" },
  description: SITE_DESC,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "OpenK Research",
    url: "/",
    title: "OpenK Research | Uncertainty has shape",
    description: SITE_DESC,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "OpenK Research. Uncertainty has shape." },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenK Research | Uncertainty has shape",
    description: SITE_DESC,
    images: ["/og.png"],
  },
};
const ld = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OpenK Research",
  description: "Quantitative research on the shape of market uncertainty.",
  url: env.siteUrl,
  logo: `${env.siteUrl}/logo_square.png`,
  founder: { "@type": "Person", name: "Max Krehbiel", jobTitle: "Founder and Primary Researcher" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="nav">
          <div className="wrap row">
            <Link href="/" aria-label="OpenK Research home" className="home-link">
              <OpenKLogo markSize={26} wordSize={18} />
            </Link>
            <Nav />
          </div>
        </header>
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </body>
    </html>
  );
}
