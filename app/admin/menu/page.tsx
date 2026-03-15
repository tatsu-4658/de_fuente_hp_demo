"use client";

import { useEffect, useState } from "react";

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

interface MenuData {
  categories: Category[];
}

export default function AdminMenuPage() {
  const [data, setData] = useState<MenuData>({ categories: [] });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [form, setForm] = useState({ name: "", price: 0, description: "", categoryId: "" });
  const [catForm, setCatForm] = useState({ name: "" });

  const fetchData = async () => {
    const res = await fetch("/api/menu");
    setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const addCategory = async () => {
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", name: catForm.name }),
    });
    setCatForm({ name: "" });
    setShowAddCategory(false);
    fetchData();
  };

  const addItem = async (categoryId: string) => {
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, categoryId }),
    });
    setForm({ name: "", price: 0, description: "", categoryId: "" });
    setShowAddItem(null);
    fetchData();
  };

  const updateItem = async () => {
    if (!editingItem) return;
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem.id,
        name: form.name,
        price: form.price,
        description: form.description || null,
      }),
    });
    setEditingItem(null);
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("このメニューを削除しますか？")) return;
    await fetch(`/api/menu?id=${id}&type=item`, { method: "DELETE" });
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("このカテゴリとすべてのメニューを削除しますか？")) return;
    await fetch(`/api/menu?id=${id}&type=category`, { method: "DELETE" });
    fetchData();
  };

  const updateCategoryName = async (id: string) => {
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", id, name: catForm.name }),
    });
    setEditingCategory(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cafe-brown">メニュー管理</h1>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-cafe-brown text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cafe-brown-dark transition-colors"
        >
          カテゴリ追加
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="bg-white rounded-lg border border-cafe-border p-4 mb-4">
          <h3 className="font-bold text-sm mb-2">新しいカテゴリ</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="カテゴリ名"
              value={catForm.name}
              onChange={(e) => setCatForm({ name: e.target.value })}
              className="flex-1 border border-cafe-border rounded px-3 py-1.5 text-sm"
            />
            <button onClick={addCategory} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">追加</button>
            <button onClick={() => setShowAddCategory(false)} className="text-gray-500 px-2 text-sm">キャンセル</button>
          </div>
        </div>
      )}

      {/* Categories */}
      {data.categories.sort((a, b) => a.order - b.order).map((cat) => (
        <div key={cat.id} className="bg-white rounded-lg border border-cafe-border mb-4">
          <div className="flex items-center justify-between p-4 border-b border-cafe-border bg-gray-50 rounded-t-lg">
            {editingCategory === cat.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ name: e.target.value })}
                  className="flex-1 border border-cafe-border rounded px-3 py-1 text-sm"
                />
                <button onClick={() => updateCategoryName(cat.id)} className="bg-cafe-brown text-white px-3 py-1 rounded text-sm">保存</button>
                <button onClick={() => setEditingCategory(null)} className="text-gray-500 text-sm">取消</button>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-cafe-text">{cat.name}（{cat.items.length}品）</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingCategory(cat.id); setCatForm({ name: cat.name }); }}
                    className="text-sm text-cafe-brown hover:underline"
                  >
                    編集
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-sm text-red-500 hover:underline">削除</button>
                  <button
                    onClick={() => setShowAddItem(cat.id)}
                    className="text-sm bg-cafe-accent text-cafe-brown-dark px-3 py-1 rounded font-bold"
                  >
                    メニュー追加
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add Item Form */}
          {showAddItem === cat.id && (
            <div className="p-4 bg-cafe-bg-warm border-b border-cafe-border">
              <h3 className="font-bold text-sm mb-3">新しいメニュー</h3>
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
                <textarea
                  placeholder="説明文（任意）"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="border border-cafe-border rounded px-3 py-1.5 text-sm sm:col-span-2"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => addItem(cat.id)} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">追加</button>
                <button onClick={() => setShowAddItem(null)} className="text-gray-500 text-sm">キャンセル</button>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="divide-y divide-cafe-border">
            {cat.items.map((item) => (
              <div key={item.id} className="p-4">
                {editingItem?.id === item.id ? (
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
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border border-cafe-border rounded px-3 py-1.5 text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button onClick={updateItem} className="bg-cafe-brown text-white px-4 py-1 rounded text-sm">保存</button>
                      <button onClick={() => setEditingItem(null)} className="text-gray-500 text-sm">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-cafe-text">{item.name}</h3>
                      <p className="text-sm text-cafe-brown font-bold">&yen;{item.price.toLocaleString()}</p>
                      {item.description && (
                        <p className="text-sm text-cafe-text-light mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setForm({ name: item.name, price: item.price, description: item.description || "", categoryId: cat.id });
                        }}
                        className="text-sm text-cafe-brown hover:underline"
                      >
                        編集
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="text-sm text-red-500 hover:underline">
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {cat.items.length === 0 && (
              <p className="p-4 text-sm text-cafe-text-light">メニューがありません</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
