import {NextRequest, NextResponse} from "next/server";
import {clients} from "@/app/lib/store";

export async function POST(req: NextRequest) {

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const body = await req.json();
    clients.set(ip, { ip, ...body, lastSeen: Date.now() });

    return NextResponse.json({ ok: true });

}

export async function GET() {

    return NextResponse.json([...clients.values()]);

}