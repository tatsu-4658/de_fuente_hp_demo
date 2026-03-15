import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export function isDbAvailable(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

// ---- Menu ----

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

export async function dbGetMenu(): Promise<MenuData> {
  const sql = getSQL();
  const cats = await sql`SELECT id, name, sort_order as "order" FROM menu_categories ORDER BY sort_order`;
  const items = await sql`SELECT id, category_id, name, price, description, image FROM menu_items`;

  const categories: Category[] = cats.map((c) => ({
    id: c.id as string,
    name: c.name as string,
    order: c.order as number,
    items: items
      .filter((i) => i.category_id === c.id)
      .map((i) => ({
        id: i.id as string,
        name: i.name as string,
        price: i.price as number,
        description: (i.description as string) || null,
        image: (i.image as string) || null,
      })),
  }));

  return { categories };
}

export async function dbAddCategory(name: string): Promise<string> {
  const sql = getSQL();
  const id = `cat_${Date.now()}`;
  const rows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM menu_categories`;
  const order = rows[0].next_order as number;
  await sql`INSERT INTO menu_categories (id, name, sort_order) VALUES (${id}, ${name}, ${order})`;
  return id;
}

export async function dbUpdateCategory(id: string, name?: string, order?: number): Promise<void> {
  const sql = getSQL();
  if (name !== undefined) await sql`UPDATE menu_categories SET name = ${name} WHERE id = ${id}`;
  if (order !== undefined) await sql`UPDATE menu_categories SET sort_order = ${order} WHERE id = ${id}`;
}

export async function dbDeleteCategory(id: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM menu_items WHERE category_id = ${id}`;
  await sql`DELETE FROM menu_categories WHERE id = ${id}`;
}

export async function dbAddMenuItem(categoryId: string, name: string, price: number, description: string | null, image: string | null): Promise<string> {
  const sql = getSQL();
  const id = `item_${Date.now()}`;
  await sql`INSERT INTO menu_items (id, category_id, name, price, description, image) VALUES (${id}, ${categoryId}, ${name}, ${price}, ${description}, ${image})`;
  return id;
}

export async function dbUpdateMenuItem(id: string, name?: string, price?: number, description?: string | null, image?: string | null): Promise<void> {
  const sql = getSQL();
  if (name !== undefined) await sql`UPDATE menu_items SET name = ${name} WHERE id = ${id}`;
  if (price !== undefined) await sql`UPDATE menu_items SET price = ${price} WHERE id = ${id}`;
  if (description !== undefined) await sql`UPDATE menu_items SET description = ${description} WHERE id = ${id}`;
  if (image !== undefined) await sql`UPDATE menu_items SET image = ${image} WHERE id = ${id}`;
}

export async function dbDeleteMenuItem(id: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
}

// ---- Weekly Menu ----

interface WeeklyMenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  startDate: string;
  endDate: string;
}

interface WeeklyMenuData {
  items: WeeklyMenuItem[];
}

export async function dbGetWeeklyMenu(): Promise<WeeklyMenuData> {
  const sql = getSQL();
  const rows = await sql`SELECT id, name, price, description, image, start_date, end_date FROM weekly_menu_items ORDER BY start_date`;
  return {
    items: rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      price: r.price as number,
      description: (r.description as string) || null,
      image: (r.image as string) || null,
      startDate: r.start_date as string,
      endDate: r.end_date as string,
    })),
  };
}

export async function dbAddWeeklyMenuItem(name: string, price: number, description: string | null, image: string | null, startDate: string, endDate: string): Promise<string> {
  const sql = getSQL();
  const id = `w_${Date.now()}`;
  await sql`INSERT INTO weekly_menu_items (id, name, price, description, image, start_date, end_date) VALUES (${id}, ${name}, ${price}, ${description}, ${image}, ${startDate}, ${endDate})`;
  return id;
}

export async function dbUpdateWeeklyMenuItem(id: string, fields: Partial<{ name: string; price: number; description: string | null; image: string | null; startDate: string; endDate: string }>): Promise<void> {
  const sql = getSQL();
  if (fields.name !== undefined) await sql`UPDATE weekly_menu_items SET name = ${fields.name} WHERE id = ${id}`;
  if (fields.price !== undefined) await sql`UPDATE weekly_menu_items SET price = ${fields.price} WHERE id = ${id}`;
  if (fields.description !== undefined) await sql`UPDATE weekly_menu_items SET description = ${fields.description} WHERE id = ${id}`;
  if (fields.image !== undefined) await sql`UPDATE weekly_menu_items SET image = ${fields.image} WHERE id = ${id}`;
  if (fields.startDate !== undefined) await sql`UPDATE weekly_menu_items SET start_date = ${fields.startDate} WHERE id = ${id}`;
  if (fields.endDate !== undefined) await sql`UPDATE weekly_menu_items SET end_date = ${fields.endDate} WHERE id = ${id}`;
}

export async function dbDeleteWeeklyMenuItem(id: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM weekly_menu_items WHERE id = ${id}`;
}

// ---- News ----

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
}

interface NewsData {
  items: NewsItem[];
}

export async function dbGetNews(): Promise<NewsData> {
  const sql = getSQL();
  const rows = await sql`SELECT id, title, content, date, published FROM news ORDER BY date DESC`;
  return {
    items: rows.map((r) => ({
      id: r.id as string,
      title: r.title as string,
      content: r.content as string,
      date: r.date as string,
      published: r.published as boolean,
    })),
  };
}

export async function dbAddNewsItem(title: string, content: string, date: string, published: boolean): Promise<string> {
  const sql = getSQL();
  const id = `n_${Date.now()}`;
  await sql`INSERT INTO news (id, title, content, date, published) VALUES (${id}, ${title}, ${content}, ${date}, ${published})`;
  return id;
}

export async function dbUpdateNewsItem(id: string, fields: Partial<{ title: string; content: string; date: string; published: boolean }>): Promise<void> {
  const sql = getSQL();
  if (fields.title !== undefined) await sql`UPDATE news SET title = ${fields.title} WHERE id = ${id}`;
  if (fields.content !== undefined) await sql`UPDATE news SET content = ${fields.content} WHERE id = ${id}`;
  if (fields.date !== undefined) await sql`UPDATE news SET date = ${fields.date} WHERE id = ${id}`;
  if (fields.published !== undefined) await sql`UPDATE news SET published = ${fields.published} WHERE id = ${id}`;
}

export async function dbDeleteNewsItem(id: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM news WHERE id = ${id}`;
}

// ---- Calendar ----

interface CalendarData {
  businessHours: { open: string; close: string };
  regularHolidays: number[];
  overrides: Record<string, string>;
}

export async function dbGetCalendar(): Promise<CalendarData> {
  const sql = getSQL();
  const settings = await sql`SELECT key, value FROM calendar_settings`;
  const overrideRows = await sql`SELECT date, status FROM calendar_overrides`;

  let businessHours = { open: "10:00", close: "18:00" };
  let regularHolidays: number[] = [0, 6];

  for (const s of settings) {
    if (s.key === "business_hours") businessHours = JSON.parse(s.value as string);
    if (s.key === "regular_holidays") regularHolidays = JSON.parse(s.value as string);
  }

  const overrides: Record<string, string> = {};
  for (const o of overrideRows) {
    overrides[o.date as string] = o.status as string;
  }

  return { businessHours, regularHolidays, overrides };
}

export async function dbUpdateCalendarSettings(businessHours?: { open: string; close: string }, regularHolidays?: number[]): Promise<void> {
  const sql = getSQL();
  if (businessHours) {
    await sql`INSERT INTO calendar_settings (key, value) VALUES ('business_hours', ${JSON.stringify(businessHours)}) ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(businessHours)}`;
  }
  if (regularHolidays !== undefined) {
    await sql`INSERT INTO calendar_settings (key, value) VALUES ('regular_holidays', ${JSON.stringify(regularHolidays)}) ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(regularHolidays)}`;
  }
}

export async function dbSetCalendarOverride(date: string, status: string): Promise<void> {
  const sql = getSQL();
  await sql`INSERT INTO calendar_overrides (date, status) VALUES (${date}, ${status}) ON CONFLICT (date) DO UPDATE SET status = ${status}`;
}

export async function dbRemoveCalendarOverride(date: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM calendar_overrides WHERE date = ${date}`;
}

// ---- Shop Info ----

export async function dbGetShopInfo(): Promise<Record<string, unknown>> {
  const sql = getSQL();
  const rows = await sql`SELECT key, value FROM shop_info`;
  const result: Record<string, unknown> = {};
  for (const r of rows) {
    result[r.key as string] = JSON.parse(r.value as string);
  }
  return result;
}

export async function dbUpdateShopInfo(data: Record<string, unknown>): Promise<void> {
  const sql = getSQL();
  for (const [key, value] of Object.entries(data)) {
    const jsonVal = JSON.stringify(value);
    await sql`INSERT INTO shop_info (key, value) VALUES (${key}, ${jsonVal}) ON CONFLICT (key) DO UPDATE SET value = ${jsonVal}`;
  }
}

// ---- Setup / Migration ----

export async function dbSetup(): Promise<void> {
  const sql = getSQL();

  await sql`CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`;

  await sql`CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES menu_categories(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image TEXT
  )`;

  await sql`CREATE TABLE IF NOT EXISTS weekly_menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT true
  )`;

  await sql`CREATE TABLE IF NOT EXISTS calendar_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS calendar_overrides (
    date TEXT PRIMARY KEY,
    status TEXT NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS shop_info (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`;
}
