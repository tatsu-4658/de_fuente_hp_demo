import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  isDbAvailable,
  dbSetup,
  dbAddCategory,
  dbAddMenuItem,
  dbAddWeeklyMenuItem,
  dbAddNewsItem,
  dbUpdateCalendarSettings,
  dbSetCalendarOverride,
  dbUpdateShopInfo,
  dbGetMenu,
} from "@/lib/db";
import { readJsonFile } from "@/lib/data";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbAvailable()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 500 });
  }

  try {
    // Create tables
    await dbSetup();

    // Check if data already exists
    const existing = await dbGetMenu();
    if (existing.categories.length > 0) {
      return NextResponse.json({ message: "Database already has data. Setup skipped.", status: "skipped" });
    }

    // Seed from JSON files
    // Menu
    const menuJson = await readJsonFile<{ categories: { id: string; name: string; order: number; items: { id: string; name: string; price: number; description: string | null; image: string | null }[] }[] }>("menu.json");
    for (const cat of menuJson.categories) {
      await dbAddCategory(cat.name);
      // Get the actual ID (timestamp-based)
      const menu = await dbGetMenu();
      const dbCat = menu.categories.find((c) => c.name === cat.name);
      if (dbCat) {
        for (const item of cat.items) {
          await dbAddMenuItem(dbCat.id, item.name, item.price, item.description, item.image);
        }
      }
    }

    // Weekly menu
    const weeklyJson = await readJsonFile<{ items: { name: string; price: number; description: string | null; image: string | null; startDate: string; endDate: string }[] }>("weekly-menu.json");
    for (const item of weeklyJson.items) {
      await dbAddWeeklyMenuItem(item.name, item.price, item.description, item.image, item.startDate, item.endDate);
    }

    // News
    const newsJson = await readJsonFile<{ items: { title: string; content: string; date: string; published: boolean }[] }>("news.json");
    for (const item of newsJson.items) {
      await dbAddNewsItem(item.title, item.content, item.date, item.published);
    }

    // Calendar
    const calJson = await readJsonFile<{ businessHours: { open: string; close: string }; regularHolidays: number[]; overrides: Record<string, string> }>("calendar.json");
    await dbUpdateCalendarSettings(calJson.businessHours, calJson.regularHolidays);
    for (const [date, status] of Object.entries(calJson.overrides)) {
      await dbSetCalendarOverride(date, status);
    }

    // Shop info
    const shopJson = await readJsonFile<Record<string, unknown>>("shop-info.json");
    await dbUpdateShopInfo(shopJson);

    return NextResponse.json({ message: "Database setup and seed completed successfully.", status: "success" });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
