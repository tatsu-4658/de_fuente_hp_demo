import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const data = await readJsonFile("shop-info.json");
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = await readJsonFile<Record<string, unknown>>("shop-info.json");

  const updated = { ...data, ...body };
  await writeJsonFile("shop-info.json", updated);
  return NextResponse.json(updated);
}
