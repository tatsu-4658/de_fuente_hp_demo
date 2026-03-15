"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", date: "", published: true });

  const fetchData = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = async () => {
    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", content: "", date: "", published: true });
    setShowAdd(false);
    fetchData();
  };

  const updateItem = async (id: string) => {
    await fetch("/api/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    setEditing(null);
    fetchData();
  };

  const togglePublished = async (item: NewsItem) => {
    await fetch("/api/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: !item.published }),
    });
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cafe-brown">お知らせ管理</h1>
        <button
          onClick={() => { setShowAdd(true); setForm({ title: "", content: "", date: new Date().toISOString().split("T")[0], published: true }); }}
          className="bg-cafe-brown text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cafe-brown-dark transition-colors"
        >
          追加
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-lg border border-cafe-border p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">新しいお知らせ</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="タイトル"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <textarea
              placeholder="内容"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
              rows={3}
            />
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border border-cafe-border rounded px-3 py-1.5 text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                公開
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addItem} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">追加</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 text-sm">キャンセル</button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.sort((a, b) => b.date.localeCompare(a.date)).map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-cafe-border p-4">
            {editing === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                />
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                  rows={3}
                />
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="border border-cafe-border rounded px-3 py-1.5 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    />
                    公開
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateItem(item.id)} className="bg-cafe-brown text-white px-4 py-1 rounded text-sm">保存</button>
                  <button onClick={() => setEditing(null)} className="text-gray-500 text-sm">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {item.published ? "公開" : "非公開"}
                    </span>
                    <span className="text-xs text-cafe-text-light">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-cafe-text">{item.title}</h3>
                  <p className="text-sm text-cafe-text-light mt-1">{item.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublished(item)} className="text-sm text-cafe-brown hover:underline">
                    {item.published ? "非公開" : "公開"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setForm({ title: item.title, content: item.content, date: item.date, published: item.published });
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
          <p className="text-cafe-text-light text-sm">お知らせが登録されていません</p>
        )}
      </div>
    </div>
  );
}
