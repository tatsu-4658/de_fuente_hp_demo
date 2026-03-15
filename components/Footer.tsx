import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cafe-brown-dark text-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">café de fuente</h3>
            <p className="text-sm text-cafe-accent-light">カフェ デ フェンテ</p>
            <p className="text-sm text-gray-300 mt-3">
              泉のように湧き出る安らぎの時間を。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">営業情報</h4>
            <p className="text-sm text-gray-300">営業時間: 10:00 〜 18:00</p>
            <p className="text-sm text-gray-300">定休日: 土曜・日曜</p>
            <p className="text-sm text-gray-300 mt-2">TEL: 00-0000-0000</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">ページ</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">ホーム</Link>
              <Link href="/menu" className="text-sm text-gray-300 hover:text-white transition-colors">メニュー</Link>
              <Link href="/calendar" className="text-sm text-gray-300 hover:text-white transition-colors">営業日カレンダー</Link>
              <Link href="/access" className="text-sm text-gray-300 hover:text-white transition-colors">アクセス</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-cafe-brown-light mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">&copy; 2026 café de fuente. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
