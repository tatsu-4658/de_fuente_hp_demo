import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, getNewsData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import {
  isDbAvailable,
  dbGetNews,
  dbAddNewsItem,
  dbUpdateNewsItem,
  dbDeleteNewsItem,
} from "@/lib/db";

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

export async function GET() {
  const data = await getNewsData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    await dbAddNewsItem(
      body.title,
      body.content,
      body.date || new Date().toISOString().split("T")[0],
      body.published ?? true,
    );
    return NextResponse.json(await dbGetNews());
  }

  const data = await readJsonFile<NewsData>("news.json");
  data.items.push({
    id: `n_${Date.now()}`,
    title: body.title,
    content: body.content,
    date: body.date || new Date().toISOString().split("T")[0],
    published: body.published ?? true,
  });
  await writeJsonFile("news.json", data);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    await dbUpdateNewsItem(body.id, {
      title: body.title,
      content: body.content,
      date: body.date,
      published: body.published,
    });
    return NextResponse.json(await dbGetNews());
  }

  const data = await readJsonFile<NewsData>("news.json");
  const item = data.items.find((i) => i.id === body.id);
  if (item) {
    item.title = body.title ?? item.title;
    item.content = body.content ?? item.content;
    item.date = body.date ?? item.date;
    item.published = body.published !== undefined ? body.published : item.published;
  }
  await writeJsonFile("news.json", data);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (isDbAvailable()) {
    await dbDeleteNewsItem(id!);
    return NextResponse.json(await dbGetNews());
  }

  const data = await readJsonFile<NewsData>("news.json");
  data.items = data.items.filter((i) => i.id !== id);
  await writeJsonFile("news.json", data);
  return NextResponse.json(data);
}
