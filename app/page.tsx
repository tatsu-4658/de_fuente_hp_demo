import Link from "next/link";
import shopInfo from "@/data/shop-info.json";
import newsData from "@/data/news.json";
import weeklyMenuData from "@/data/weekly-menu.json";
import calendarData from "@/data/calendar.json";

function isOpen(): { open: boolean; message: string } {
  const now = new Date();
  const day = now.getDay();
  const dateStr = now.toISOString().split("T")[0];

  const override = calendarData.overrides[dateStr as keyof typeof calendarData.overrides];
  if (override === "closed") return { open: false, message: "本日は臨時休業です" };
  if (override === "open") return { open: true, message: `本日は営業中（${calendarData.businessHours.open}〜${calendarData.businessHours.close}）` };

  if (calendarData.regularHolidays.includes(day)) {
    return { open: false, message: "本日は定休日です" };
  }
  return { open: true, message: `本日は営業中（${calendarData.businessHours.open}〜${calendarData.businessHours.close}）` };
}

function getActiveWeeklyMenu() {
  const today = new Date().toISOString().split("T")[0];
  return weeklyMenuData.items.filter(
    (item) => item.startDate <= today && item.endDate >= today
  );
}

export default function HomePage() {
  const status = isOpen();
  const weeklyItems = getActiveWeeklyMenu();
  const publishedNews = newsData.items
    .filter((n) => n.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cafe-brown to-cafe-brown-dark text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{shopInfo.name}</h1>
          <p className="text-cafe-accent-light text-lg mb-6">{shopInfo.nameJa}</p>
          <p className="text-gray-200 max-w-xl mx-auto leading-relaxed">
            {shopInfo.concept}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-cafe-accent text-cafe-brown-dark px-6 py-3 rounded-lg font-bold hover:bg-cafe-accent-light transition-colors"
            >
              メニューを見る
            </Link>
            <Link
              href="/access"
              className="border border-white/30 px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              アクセス
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-cafe-brown mb-6 border-b-2 border-cafe-accent pb-2">
          お知らせ
        </h2>
        <div className="space-y-4">
          {publishedNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg p-4 border border-cafe-border"
            >
              <div className="flex items-start gap-4">
                <time className="text-sm text-cafe-text-light whitespace-nowrap">
                  {news.date}
                </time>
                <div>
                  <h3 className="font-bold text-cafe-text">{news.title}</h3>
                  <p className="text-sm text-cafe-text-light mt-1">{news.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Menu & Business Info */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Menu */}
          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="text-lg font-bold text-cafe-brown mb-4 flex items-center gap-2">
              <span className="text-cafe-accent">&#9733;</span>
              今週のおすすめ
            </h2>
            {weeklyItems.length > 0 ? (
              <div className="space-y-3">
                {weeklyItems.map((item) => (
                  <div key={item.id} className="border-b border-cafe-border pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-cafe-text">{item.name}</h3>
                      <span className="text-cafe-brown font-bold">&yen;{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-cafe-text-light mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cafe-text-light text-sm">今週のおすすめメニューは準備中です。</p>
            )}
            <Link
              href="/menu"
              className="inline-block mt-4 text-sm text-cafe-brown hover:underline"
            >
              メニュー一覧を見る &rarr;
            </Link>
          </div>

          {/* Business Status */}
          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="text-lg font-bold text-cafe-brown mb-4">営業情報</h2>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${
                status.open
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.message}
            </div>
            <div className="space-y-2 text-sm text-cafe-text-light">
              <p>営業時間: {shopInfo.businessHours.open} 〜 {shopInfo.businessHours.close}</p>
              <p>ラストオーダー: {shopInfo.businessHours.lastOrder}</p>
              <p>定休日: 土曜日・日曜日</p>
            </div>
            <Link
              href="/calendar"
              className="inline-block mt-4 text-sm text-cafe-brown hover:underline"
            >
              営業日カレンダーを見る &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
