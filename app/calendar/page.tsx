"use client";

import { useState } from "react";
import type { Metadata } from "next";
import calendarData from "@/data/calendar.json";

type DayStatus = "open" | "closed" | "regular-holiday" | "special-open" | "special-closed";

function getDayStatus(year: number, month: number, day: number): DayStatus {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const override = calendarData.overrides[dateStr as keyof typeof calendarData.overrides];
  if (override === "closed") return "special-closed";
  if (override === "open") return "special-open";

  if (calendarData.regularHolidays.includes(dayOfWeek)) {
    return "regular-holiday";
  }
  return "open";
}

const statusConfig: Record<DayStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-green-100", text: "text-green-800", label: "営業日" },
  closed: { bg: "bg-gray-100", text: "text-gray-400", label: "休業日" },
  "regular-holiday": { bg: "bg-gray-200", text: "text-gray-500", label: "定休日" },
  "special-open": { bg: "bg-blue-100", text: "text-blue-700", label: "臨時営業" },
  "special-closed": { bg: "bg-red-100", text: "text-red-700", label: "臨時休業" },
};

const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-cafe-brown mb-8">
        営業日カレンダー
      </h1>

      {/* Business hours */}
      <div className="bg-white rounded-lg p-4 border border-cafe-border mb-6">
        <p className="text-sm text-cafe-text">
          営業時間: <span className="font-bold">{calendarData.businessHours.open} 〜 {calendarData.businessHours.close}</span>
        </p>
        <p className="text-sm text-cafe-text-light mt-1">
          定休日: 土曜日・日曜日
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-4 py-2 text-cafe-brown hover:bg-cafe-bg-warm rounded-lg transition-colors"
          aria-label="前月"
        >
          &larr; 前月
        </button>
        <h2 className="text-xl font-bold text-cafe-text">
          {year}年{month + 1}月
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 text-cafe-brown hover:bg-cafe-bg-warm rounded-lg transition-colors"
          aria-label="翌月"
        >
          翌月 &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-cafe-border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-cafe-border">
          {dayLabels.map((label, i) => (
            <div
              key={label}
              className={`py-2 text-center text-sm font-bold ${
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-cafe-text"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2 min-h-[60px]" />;
            }

            const status = getDayStatus(year, month, day);
            const config = statusConfig[status];
            const isToday =
              year === today.getFullYear() &&
              month === today.getMonth() &&
              day === today.getDate();

            return (
              <div
                key={day}
                className={`p-2 min-h-[60px] border-t border-r border-cafe-border/50 ${config.bg}`}
              >
                <span
                  className={`text-sm font-bold ${config.text} ${
                    isToday ? "bg-cafe-brown text-white rounded-full w-6 h-6 flex items-center justify-center" : ""
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          <span className="text-sm text-cafe-text-light">営業日</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300" />
          <span className="text-sm text-cafe-text-light">定休日</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          <span className="text-sm text-cafe-text-light">臨時休業</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
          <span className="text-sm text-cafe-text-light">臨時営業</span>
        </div>
      </div>
    </div>
  );
}
