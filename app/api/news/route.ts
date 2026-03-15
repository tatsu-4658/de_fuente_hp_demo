import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

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
  const data = await readJsonFile<NewsData>("news.json");
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = await readJsonFile<NewsData>("news.json");

  const newItem: NewsItem = {
    id: `n_${Date.now()}`,
    title: body.title,
    content: body.content,
    date: body.date || new Date().toISOString().split("T")[0],
    published: body.published ?? true,
  };
  data.items.push(newItem);

  await writeJsonFile("news.json", data);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
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
  const data = await readJsonFile<NewsData>("news.json");
  data.items = data.items.filter((i) => i.id !== id);

  await writeJsonFile("news.json", data);
  return NextResponse.json(data);
}
