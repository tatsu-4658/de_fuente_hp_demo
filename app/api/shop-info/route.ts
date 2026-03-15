import { NextRequest, NextResponse } from "next/server";
import { getShopInfoData, updateShopInfoData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const data = await getShopInfoData();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updateShopInfoData(body);
  return NextResponse.json(updated);
}
