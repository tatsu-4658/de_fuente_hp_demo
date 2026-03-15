"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/menu", label: "メニュー管理" },
  { href: "/admin/weekly-menu", label: "週替わりメニュー" },
  { href: "/admin/calendar", label: "営業日管理" },
  { href: "/admin/news", label: "お知らせ管理" },
  { href: "/admin/shop-info", label: "店舗情報" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page doesn't need the admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-cafe-brown-dark text-white flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-cafe-brown">
          <h2 className="font-bold text-sm">Cafe Komorebi</h2>
          <p className="text-xs text-cafe-accent-light">管理画面</p>
        </div>
        <nav className="py-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                pathname === link.href
                  ? "bg-cafe-brown text-white"
                  : "text-gray-300 hover:bg-cafe-brown hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-cafe-brown">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ログアウト
          </button>
          <Link
            href="/"
            className="block text-sm text-gray-300 hover:text-white transition-colors mt-2"
          >
            公開サイトへ
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-cafe-brown-dark text-white p-3 z-50 flex items-center justify-between">
        <span className="font-bold text-sm">管理画面</span>
        <div className="flex gap-3">
          <Link href="/" className="text-xs text-gray-300">公開サイト</Link>
          <button onClick={handleLogout} className="text-xs text-gray-300">ログアウト</button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex overflow-x-auto">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-shrink-0 px-3 py-2 text-xs text-center ${
              pathname === link.href ? "text-cafe-brown font-bold border-t-2 border-cafe-brown" : "text-gray-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 md:pt-6 mt-12 md:mt-0 mb-12 md:mb-0">
        {children}
      </main>
    </div>
  );
}
