import type { Metadata } from "next";
import { getMenuData, getWeeklyMenuData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "メニュー | café de fuente",
  description: "café de fuenteのメニュー一覧。こだわりのドリンク、フード、デザートをご覧ください。",
};

interface WeeklyMenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  startDate: string;
  endDate: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
}

interface Category {
  id: string;
  name: string;
  order: number;
  items: MenuItem[];
}

export default async function MenuPage() {
  const [menuData, weeklyMenuData] = await Promise.all([
    getMenuData(),
    getWeeklyMenuData(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const weeklyItems = (weeklyMenuData.items as WeeklyMenuItem[]).filter(
    (item) => item.startDate <= today && item.endDate >= today
  );
  const categories = [...(menuData.categories as Category[])].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-cafe-brown mb-8">メニュー</h1>

      {/* Weekly Menu */}
      {weeklyItems.length > 0 && (
        <section className="mb-12">
          <div className="bg-gradient-to-r from-cafe-accent/20 to-cafe-accent-light/20 rounded-xl p-6 border border-cafe-accent/30">
            <h2 className="text-xl font-bold text-cafe-brown mb-1 flex items-center gap-2">
              <span className="text-cafe-accent">&#9733;</span>
              週替わりメニュー
            </h2>
            <p className="text-sm text-cafe-text-light mb-4">
              {weeklyItems[0]?.startDate} 〜 {weeklyItems[0]?.endDate}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weeklyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-5 border border-cafe-border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-cafe-text text-lg">{item.name}</h3>
                    <span className="text-cafe-brown font-bold text-lg">
                      &yen;{item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-cafe-text-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Menu */}
      {categories.map((category) => (
        <section key={category.id} className="mb-10">
          <h2 className="text-xl font-bold text-cafe-brown mb-4 border-b-2 border-cafe-accent pb-2">
            {category.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) =>
              item.image ? (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden border border-cafe-border hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-cafe-bg-warm flex items-center justify-center text-cafe-text-light text-sm">
                    写真準備中
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-cafe-text">{item.name}</h3>
                      <span className="text-cafe-brown font-bold">
                        &yen;{item.price.toLocaleString()}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-cafe-text-light">{item.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 border border-cafe-border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-cafe-text">{item.name}</h3>
                    <span className="text-cafe-brown font-bold whitespace-nowrap ml-2">
                      &yen;{item.price.toLocaleString()}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-cafe-text-light">{item.description}</p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      ))}

      <p className="text-xs text-cafe-text-light text-center mt-8">
        ※ 表示価格はすべて税込です。
      </p>
    </div>
  );
}
