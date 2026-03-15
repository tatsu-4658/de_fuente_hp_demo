import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, getWeeklyMenuData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import {
  isDbAvailable,
  dbGetWeeklyMenu,
  dbAddWeeklyMenuItem,
  dbUpdateWeeklyMenuItem,
  dbDeleteWeeklyMenuItem,
} from "@/lib/db";

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

export async function GET() {
  const data = await getWeeklyMenuData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    await dbAddWeeklyMenuItem(body.name, body.price, body.description || null, body.image || null, body.startDate, body.endDate);
    return NextResponse.json(await dbGetWeeklyMenu());
  }

  const data = await readJsonFile<WeeklyMenuData>("weekly-menu.json");
  data.items.push({
    id: `w_${Date.now()}`,
    name: body.name,
    price: body.price,
    description: body.description || null,
    image: body.image || null,
    startDate: body.startDate,
    endDate: body.endDate,
  });
  await writeJsonFile("weekly-menu.json", data);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    await dbUpdateWeeklyMenuItem(body.id, {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      startDate: body.startDate,
      endDate: body.endDate,
    });
    return NextResponse.json(await dbGetWeeklyMenu());
  }

  const data = await readJsonFile<WeeklyMenuData>("weekly-menu.json");
  const item = data.items.find((i) => i.id === body.id);
  if (item) {
    item.name = body.name ?? item.name;
    item.price = body.price ?? item.price;
    item.description = body.description !== undefined ? body.description : item.description;
    item.image = body.image !== undefined ? body.image : item.image;
    item.startDate = body.startDate ?? item.startDate;
    item.endDate = body.endDate ?? item.endDate;
  }
  await writeJsonFile("weekly-menu.json", data);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (isDbAvailable()) {
    await dbDeleteWeeklyMenuItem(id!);
    return NextResponse.json(await dbGetWeeklyMenu());
  }

  const data = await readJsonFile<WeeklyMenuData>("weekly-menu.json");
  data.items = data.items.filter((i) => i.id !== id);
  await writeJsonFile("weekly-menu.json", data);
  return NextResponse.json(data);
}
