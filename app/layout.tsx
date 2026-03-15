import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cafe Komorebi | カフェ こもれび",
  description: "木漏れ日のようなやさしい時間を。こだわりの自家焙煎コーヒーと手作りスイーツで、心やすらぐひとときをお過ごしください。",
  keywords: "カフェ,こもれび,コーヒー,スイーツ",
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
              name: "Cafe Komorebi",
              alternateName: "カフェ こもれび",
              address: {
                "@type": "PostalAddress",
                streetAddress: "△△1-2-3 サンプルビル1F",
                addressLocality: "○○区",
                addressRegion: "東京都",
                postalCode: "000-0000",
                addressCountry: "JP",
              },
              telephone: "00-0000-0000",
              openingHours: "Mo-Fr 10:00-18:00",
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
