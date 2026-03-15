import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cafe-brown-dark text-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Café Komorebi</h3>
            <p className="text-sm text-cafe-accent-light">カフェ こもれび</p>
            <p className="text-sm text-gray-300 mt-3">
              木漏れ日のように穏やかなひとときを。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">営業情報</h4>
            <p className="text-sm text-gray-300">営業時間: 10:00 〜 19:00</p>
            <p className="text-sm text-gray-300">定休日: 土曜・日曜</p>
            <p className="text-sm text-gray-300 mt-2">TEL: 03-1234-5678</p>
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
          <p className="text-xs text-gray-400">&copy; 2026 Café Komorebi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
