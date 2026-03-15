"use client";

import { useEffect, useState } from "react";

interface ShopInfo {
  name: string;
  nameJa: string;
  concept: string;
  address: string;
  phone: string;
  businessHours: { open: string; close: string; lastOrder: string };
  access: { nearestStation: string; bus: string; parking: string };
}

export default function AdminShopInfoPage() {
  const [info, setInfo] = useState<ShopInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/shop-info").then((r) => r.json()).then(setInfo);
  }, []);

  const save = async () => {
    if (!info) return;
    setSaving(true);
    await fetch("/api/shop-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });
    setSaving(false);
    alert("保存しました");
  };

  if (!info) return <p className="text-cafe-text-light">読み込み中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cafe-brown">店舗情報管理</h1>
        <button
          onClick={save}
          disabled={saving}
          className="bg-cafe-brown text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cafe-brown-dark transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-cafe-border p-4">
          <h2 className="font-bold text-cafe-text mb-3">基本情報</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">店舗名（英語）</label>
              <input
                type="text"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">店舗名（日本語）</label>
              <input
                type="text"
                value={info.nameJa}
                onChange={(e) => setInfo({ ...info, nameJa: e.target.value })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">コンセプト</label>
              <textarea
                value={info.concept}
                onChange={(e) => setInfo({ ...info, concept: e.target.value })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg border border-cafe-border p-4">
          <h2 className="font-bold text-cafe-text mb-3">連絡先・所在地</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">住所</label>
              <input
                type="text"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">電話番号</label>
              <input
                type="text"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg border border-cafe-border p-4">
          <h2 className="font-bold text-cafe-text mb-3">営業時間</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">開店</label>
              <input
                type="time"
                value={info.businessHours.open}
                onChange={(e) => setInfo({ ...info, businessHours: { ...info.businessHours, open: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">閉店</label>
              <input
                type="time"
                value={info.businessHours.close}
                onChange={(e) => setInfo({ ...info, businessHours: { ...info.businessHours, close: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">L.O.</label>
              <input
                type="time"
                value={info.businessHours.lastOrder}
                onChange={(e) => setInfo({ ...info, businessHours: { ...info.businessHours, lastOrder: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Access */}
        <div className="bg-white rounded-lg border border-cafe-border p-4">
          <h2 className="font-bold text-cafe-text mb-3">アクセス情報</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">最寄り駅</label>
              <input
                type="text"
                value={info.access.nearestStation}
                onChange={(e) => setInfo({ ...info, access: { ...info.access, nearestStation: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">バス</label>
              <input
                type="text"
                value={info.access.bus}
                onChange={(e) => setInfo({ ...info, access: { ...info.access, bus: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-cafe-text-light mb-1">駐車場</label>
              <input
                type="text"
                value={info.access.parking}
                onChange={(e) => setInfo({ ...info, access: { ...info.access, parking: e.target.value } })}
                className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
