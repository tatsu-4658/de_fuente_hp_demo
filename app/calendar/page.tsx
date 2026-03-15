import type { Metadata } from "next";
import { getCalendarData } from "@/lib/data";
import CalendarView from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "営業日カレンダー | Cafe Komorebi",
  description: "Cafe Komorebiの営業日カレンダー。",
};

export default async function CalendarPage() {
  const data = await getCalendarData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-cafe-brown mb-8">
        営業日カレンダー
      </h1>
      <CalendarView data={data as { businessHours: { open: string; close: string }; regularHolidays: number[]; overrides: Record<string, string> }} />
    </div>
  );
}
