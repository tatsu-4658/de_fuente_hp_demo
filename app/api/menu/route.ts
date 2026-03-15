import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, getMenuData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import {
  isDbAvailable,
  dbGetMenu,
  dbAddCategory,
  dbUpdateCategory,
  dbDeleteCategory,
  dbAddMenuItem,
  dbUpdateMenuItem,
  dbDeleteMenuItem,
} from "@/lib/db";

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

export async function GET() {
  const data = await getMenuData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    if (body.type === "category") {
      await dbAddCategory(body.name);
    } else {
      await dbAddMenuItem(body.categoryId, body.name, body.price, body.description || null, body.image || null);
    }
    return NextResponse.json(await dbGetMenu());
  }

  const data = await readJsonFile<MenuData>("menu.json");
  if (body.type === "category") {
    data.categories.push({
      id: `cat_${Date.now()}`,
      name: body.name,
      order: data.categories.length + 1,
      items: [],
    });
  } else {
    const category = data.categories.find((c) => c.id === body.categoryId);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    category.items.push({
      id: `item_${Date.now()}`,
      name: body.name,
      price: body.price,
      description: body.description || null,
      image: body.image || null,
    });
  }
  await writeJsonFile("menu.json", data);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isDbAvailable()) {
    if (body.type === "category") {
      await dbUpdateCategory(body.id, body.name, body.order);
    } else {
      await dbUpdateMenuItem(body.id, body.name, body.price, body.description, body.image);
    }
    return NextResponse.json(await dbGetMenu());
  }

  const data = await readJsonFile<MenuData>("menu.json");
  if (body.type === "category") {
    const category = data.categories.find((c) => c.id === body.id);
    if (category) {
      category.name = body.name ?? category.name;
      if (body.order !== undefined) category.order = body.order;
    }
  } else {
    for (const cat of data.categories) {
      const item = cat.items.find((i) => i.id === body.id);
      if (item) {
        item.name = body.name ?? item.name;
        item.price = body.price ?? item.price;
        item.description = body.description !== undefined ? body.description : item.description;
        item.image = body.image !== undefined ? body.image : item.image;
        break;
      }
    }
  }
  await writeJsonFile("menu.json", data);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (isDbAvailable()) {
    if (type === "category") {
      await dbDeleteCategory(id!);
    } else {
      await dbDeleteMenuItem(id!);
    }
    return NextResponse.json(await dbGetMenu());
  }

  const data = await readJsonFile<MenuData>("menu.json");
  if (type === "category") {
    data.categories = data.categories.filter((c) => c.id !== id);
  } else {
    for (const cat of data.categories) {
      cat.items = cat.items.filter((i) => i.id !== id);
    }
  }
  await writeJsonFile("menu.json", data);
  return NextResponse.json(data);
}
