import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KM Motor Traders | Used Cars Dandenong",
  description:
    "Quality used cars at fair prices. KM Motor Traders — LMCT 11727 — 19 Hammond Road, Dandenong VIC 3175. Call 0410 052 424.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-ink antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
