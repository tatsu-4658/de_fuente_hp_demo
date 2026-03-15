"use client";

import { useEffect, useState } from "react";

interface WeeklyMenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  startDate: string;
  endDate: string;
}

export default function AdminWeeklyMenuPage() {
  const [items, setItems] = useState<WeeklyMenuItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", price: 0, description: "", startDate: "", endDate: "",
  });

  const fetchData = async () => {
    const res = await fetch("/api/weekly-menu");
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = async () => {
    await fetch("/api/weekly-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", price: 0, description: "", startDate: "", endDate: "" });
    setShowAdd(false);
    fetchData();
  };

  const updateItem = async (id: string) => {
    await fetch("/api/weekly-menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    setEditing(null);
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/weekly-menu?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cafe-brown">週替わりメニュー管理</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-cafe-brown text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cafe-brown-dark transition-colors"
        >
          追加
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-lg border border-cafe-border p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">新しい週替わりメニュー</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="メニュー名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <input
              type="number"
              placeholder="価格（税込）"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <textarea
              placeholder="説明文（任意）"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-cafe-border rounded px-3 py-1.5 text-sm sm:col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addItem} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">追加</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 text-sm">キャンセル</button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-cafe-border p-4">
            {editing === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="border border-cafe-border rounded px-3 py-1.5 text-sm"
                  />
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="border border-cafe-border rounded px-3 py-1.5 text-sm"
                  />
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button onClick={() => updateItem(item.id)} className="bg-cafe-brown text-white px-4 py-1 rounded text-sm">保存</button>
                  <button onClick={() => setEditing(null)} className="text-gray-500 text-sm">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-cafe-text">{item.name}</h3>
                  <p className="text-sm text-cafe-brown font-bold">&yen;{item.price.toLocaleString()}</p>
                  <p className="text-xs text-cafe-text-light mt-1">
                    期間: {item.startDate} 〜 {item.endDate}
                  </p>
                  {item.description && (
                    <p className="text-sm text-cafe-text-light mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setForm({
                        name: item.name,
                        price: item.price,
                        description: item.description || "",
                        startDate: item.startDate,
                        endDate: item.endDate,
                      });
                    }}
                    className="text-sm text-cafe-brown hover:underline"
                  >
                    編集
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="text-sm text-red-500 hover:underline">削除</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-cafe-text-light text-sm">週替わりメニューが登録されていません</p>
        )}
      </div>
    </div>
  );
}
