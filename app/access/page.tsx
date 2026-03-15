import type { Metadata } from "next";
import shopInfo from "@/data/shop-info.json";

export const metadata: Metadata = {
  title: "アクセス | café de fuente",
  description: "café de fuente（カフェ デ フェンテ）へのアクセス方法。",
};

export default function AccessPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-cafe-brown mb-8">
        アクセス
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Google Maps Embed */}
        <div className="rounded-lg border border-cafe-border overflow-hidden min-h-[300px] md:min-h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2c51a3e0d55fcfc4!2scaf%C3%A9+de+fuente+%E3%82%AB%E3%83%95%E3%82%A7+%E3%83%87+%E3%83%95%E3%82%A7%E3%83%B3%E3%83%86!5e0!3m2!1sja!2sjp!4v1710000000000"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "300px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="café de fuenteの地図"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="font-bold text-cafe-brown mb-3">所在地</h2>
            <p className="text-cafe-text">{shopInfo.address}</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="font-bold text-cafe-brown mb-3">電話番号</h2>
            <p className="text-cafe-text">
              <a href={`tel:${shopInfo.phone}`} className="hover:underline">
                {shopInfo.phone}
              </a>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="font-bold text-cafe-brown mb-3">交通アクセス</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-cafe-text-light mb-1">電車</h3>
                <p className="text-cafe-text text-sm">{shopInfo.access.nearestStation}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-cafe-text-light mb-1">バス</h3>
                <p className="text-cafe-text text-sm">{shopInfo.access.bus}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="font-bold text-cafe-brown mb-3">駐車場</h2>
            <p className="text-cafe-text text-sm">{shopInfo.access.parking}</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-cafe-border">
            <h2 className="font-bold text-cafe-brown mb-3">営業時間</h2>
            <p className="text-cafe-text text-sm">
              {shopInfo.businessHours.open} 〜 {shopInfo.businessHours.close}
            </p>
            <p className="text-cafe-text-light text-xs mt-1">
              ラストオーダー {shopInfo.businessHours.lastOrder}
            </p>
            <p className="text-cafe-text text-sm mt-2">定休日: 土曜日・日曜日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
