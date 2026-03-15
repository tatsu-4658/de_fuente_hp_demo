import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

interface CalendarData {
  businessHours: { open: string; close: string };
  regularHolidays: number[];
  overrides: Record<string, string>;
}

export async function GET() {
  const data = await readJsonFile<CalendarData>("calendar.json");
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = await readJsonFile<CalendarData>("calendar.json");

  if (body.businessHours) {
    data.businessHours = body.businessHours;
  }
  if (body.regularHolidays !== undefined) {
    data.regularHolidays = body.regularHolidays;
  }
  if (body.overrides !== undefined) {
    data.overrides = { ...data.overrides, ...body.overrides };
  }
  if (body.removeOverride) {
    delete data.overrides[body.removeOverride];
  }

  await writeJsonFile("calendar.json", data);
  return NextResponse.json(data);
}
