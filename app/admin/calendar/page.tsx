"use client";

import { useEffect, useState } from "react";

const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

interface CalendarData {
  businessHours: { open: string; close: string };
  regularHolidays: number[];
  overrides: Record<string, string>;
}

export default function AdminCalendarPage() {
  const [data, setData] = useState<CalendarData>({
    businessHours: { open: "10:00", close: "19:00" },
    regularHolidays: [],
    overrides: {},
  });
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideType, setOverrideType] = useState("closed");

  const fetchData = async () => {
    const res = await fetch("/api/calendar");
    setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const updateHours = async () => {
    await fetch("/api/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessHours: data.businessHours }),
    });
    alert("営業時間を更新しました");
  };

  const toggleHoliday = async (day: number) => {
    const holidays = data.regularHolidays.includes(day)
      ? data.regularHolidays.filter((d) => d !== day)
      : [...data.regularHolidays, day];
    await fetch("/api/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regularHolidays: holidays }),
    });
    fetchData();
  };

  const addOverride = async () => {
    if (!overrideDate) return;
    await fetch("/api/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overrides: { [overrideDate]: overrideType } }),
    });
    setOverrideDate("");
    fetchData();
  };

  const removeOverride = async (date: string) => {
    await fetch("/api/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeOverride: date }),
    });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-cafe-brown mb-6">営業日管理</h1>

      {/* Business Hours */}
      <div className="bg-white rounded-lg border border-cafe-border p-4 mb-6">
        <h2 className="font-bold text-cafe-text mb-3">営業時間</h2>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={data.businessHours.open}
            onChange={(e) => setData({ ...data, businessHours: { ...data.businessHours, open: e.target.value } })}
            className="border border-cafe-border rounded px-3 py-1.5 text-sm"
          />
          <span className="text-cafe-text-light">〜</span>
          <input
            type="time"
            value={data.businessHours.close}
            onChange={(e) => setData({ ...data, businessHours: { ...data.businessHours, close: e.target.value } })}
            className="border border-cafe-border rounded px-3 py-1.5 text-sm"
          />
          <button onClick={updateHours} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">保存</button>
        </div>
      </div>

      {/* Regular Holidays */}
      <div className="bg-white rounded-lg border border-cafe-border p-4 mb-6">
        <h2 className="font-bold text-cafe-text mb-3">定休日（曜日）</h2>
        <div className="flex gap-2">
          {dayNames.map((name, i) => (
            <button
              key={i}
              onClick={() => toggleHoliday(i)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                data.regularHolidays.includes(i)
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="text-xs text-cafe-text-light mt-2">クリックで定休日を切り替えます</p>
      </div>

      {/* Overrides */}
      <div className="bg-white rounded-lg border border-cafe-border p-4">
        <h2 className="font-bold text-cafe-text mb-3">臨時営業・臨時休業</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="date"
            value={overrideDate}
            onChange={(e) => setOverrideDate(e.target.value)}
            className="border border-cafe-border rounded px-3 py-1.5 text-sm"
          />
          <select
            value={overrideType}
            onChange={(e) => setOverrideType(e.target.value)}
            className="border border-cafe-border rounded px-3 py-1.5 text-sm"
          >
            <option value="closed">臨時休業</option>
            <option value="open">臨時営業</option>
          </select>
          <button onClick={addOverride} className="bg-cafe-brown text-white px-4 py-1.5 rounded text-sm">追加</button>
        </div>

        <div className="space-y-2">
          {Object.entries(data.overrides).sort().map(([date, type]) => (
            <div key={date} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-cafe-text">{date}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  type === "closed" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {type === "closed" ? "臨時休業" : "臨時営業"}
                </span>
              </div>
              <button onClick={() => removeOverride(date)} className="text-sm text-red-500 hover:underline">削除</button>
            </div>
          ))}
          {Object.keys(data.overrides).length === 0 && (
            <p className="text-sm text-cafe-text-light">臨時設定はありません</p>
          )}
        </div>
      </div>
    </div>
  );
}
