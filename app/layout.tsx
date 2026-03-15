import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Café Komorebi | カフェ こもれび",
  description: "木漏れ日のように穏やかなひとときを。厳選した豆で淹れるこだわりのコーヒーと、季節の食材を使った手作りスイーツをお楽しみください。東京・表参道のカフェ。",
  keywords: "カフェ,こもれび,表参道,コーヒー,スイーツ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CafeOrCoffeeShop",
              name: "Café Komorebi",
              alternateName: "カフェ こもれび",
              address: {
                "@type": "PostalAddress",
                streetAddress: "神宮前3-15-8 こもれびビル1F",
                addressLocality: "渋谷区",
                addressRegion: "東京都",
                postalCode: "150-0001",
                addressCountry: "JP",
              },
              telephone: "03-1234-5678",
              openingHours: "Mo-Fr 10:00-19:00",
              servesCuisine: "コーヒー, スイーツ, 軽食",
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
