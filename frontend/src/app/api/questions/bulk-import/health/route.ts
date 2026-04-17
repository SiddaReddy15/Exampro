import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ status: "ok", message: "Bulk import API is live" });
}
