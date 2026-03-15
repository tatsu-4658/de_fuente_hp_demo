"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  menuCount: number;
  weeklyMenuCount: number;
  newsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ menuCount: 0, weeklyMenuCount: 0, newsCount: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then((r) => r.json()),
      fetch("/api/weekly-menu").then((r) => r.json()),
      fetch("/api/news").then((r) => r.json()),
    ]).then(([menu, weekly, news]) => {
      const menuCount = menu.categories?.reduce(
        (sum: number, cat: { items: unknown[] }) => sum + cat.items.length,
        0
      ) ?? 0;
      setStats({
        menuCount,
        weeklyMenuCount: weekly.items?.length ?? 0,
        newsCount: news.items?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    { href: "/admin/menu", label: "メニュー管理", desc: `${stats.menuCount}品のメニュー`, color: "bg-green-50 border-green-200" },
    { href: "/admin/weekly-menu", label: "週替わりメニュー", desc: `${stats.weeklyMenuCount}品登録中`, color: "bg-blue-50 border-blue-200" },
    { href: "/admin/calendar", label: "営業日管理", desc: "営業パターン・臨時設定", color: "bg-yellow-50 border-yellow-200" },
    { href: "/admin/news", label: "お知らせ管理", desc: `${stats.newsCount}件のお知らせ`, color: "bg-purple-50 border-purple-200" },
    { href: "/admin/shop-info", label: "店舗情報", desc: "住所・電話番号・アクセス", color: "bg-orange-50 border-orange-200" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cafe-brown mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`rounded-lg border p-5 hover:shadow-md transition-shadow ${card.color}`}
          >
            <h2 className="font-bold text-cafe-text mb-1">{card.label}</h2>
            <p className="text-sm text-cafe-text-light">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
