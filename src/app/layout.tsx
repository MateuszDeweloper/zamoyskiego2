import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zamoyskiego 2 | ASCANA",
  description: "ASCANA - deweloper z Mielca oferujący nowoczesne inwestycje mieszkaniowe. Sprawdź nasze aktualne i archiwalne projekty deweloperskie.",
  keywords: "deweloper, mieszkania, domy, inwestycje mieszkaniowe, nieruchomości, Mielec, ASCANA",
  authors: [{ name: "ASCANA Sp. z o.o." }],
  creator: "ASCANA Sp. z o.o.",
  publisher: "ASCANA Sp. z o.o.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Zamoyskiego 2 | ASCANA",
    description: "ASCANA - deweloper z Mielca oferujący nowoczesne inwestycje mieszkaniowe. Sprawdź nasze aktualne i archiwalne projekty deweloperskie.",
    url: "https://zamoyskiego2.ascana.pl",
    siteName: "ASCANA",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${manrope.variable} font-sans antialiased`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
