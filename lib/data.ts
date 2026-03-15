import { promises as fs } from "fs";
import path from "path";
import {
  isDbAvailable,
  dbGetMenu,
  dbGetWeeklyMenu,
  dbGetCalendar,
  dbGetNews,
  dbGetShopInfo,
  dbUpdateShopInfo,
} from "./db";

const dataDir = path.join(process.cwd(), "data");

export async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(dataDir, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Unified data access functions (DB with JSON fallback)

export async function getMenuData() {
  if (isDbAvailable()) return dbGetMenu();
  return readJsonFile<Awaited<ReturnType<typeof dbGetMenu>>>("menu.json");
}

export async function getWeeklyMenuData() {
  if (isDbAvailable()) return dbGetWeeklyMenu();
  return readJsonFile<Awaited<ReturnType<typeof dbGetWeeklyMenu>>>("weekly-menu.json");
}

export async function getCalendarData() {
  if (isDbAvailable()) return dbGetCalendar();
  return readJsonFile<Awaited<ReturnType<typeof dbGetCalendar>>>("calendar.json");
}

export async function getNewsData() {
  if (isDbAvailable()) return dbGetNews();
  return readJsonFile<Awaited<ReturnType<typeof dbGetNews>>>("news.json");
}

export async function getShopInfoData() {
  if (isDbAvailable()) return dbGetShopInfo();
  return readJsonFile<Record<string, unknown>>("shop-info.json");
}

export async function updateShopInfoData(data: Record<string, unknown>) {
  if (isDbAvailable()) {
    await dbUpdateShopInfo(data);
    return dbGetShopInfo();
  }
  const current = await readJsonFile<Record<string, unknown>>("shop-info.json");
  const updated = { ...current, ...data };
  await writeJsonFile("shop-info.json", updated);
  return updated;
}
