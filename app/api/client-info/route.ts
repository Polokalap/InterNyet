import { NextRequest, NextResponse } from "next/server";
import { clients } from "@/app/lib/store";
import { runAction, getClientIp } from "@/app/lib/security";
import { z } from "zod";

const MAX_CLIENTS = 10_000;

const ClientInfo = z.object({
    platform: z.string().max(64).optional(),
    userAgent: z.string().max(512).optional(),
    screen: z.string().max(32).optional(),
}).strict();

export async function POST(req: NextRequest) {

    const limit = await runAction("client-info");
    if (!limit.allowed) return new NextResponse(null, { status: 429 });

    const ip = await getClientIp();

    let body: unknown;
    try { body = await req.json(); } catch { return new NextResponse(null, { status: 400 }); }

    const parsed = ClientInfo.safeParse(body);
    if (!parsed.success) return new NextResponse(null, { status: 400 });

    if (clients.size >= MAX_CLIENTS && !clients.has(ip)) {

        return new NextResponse(null, { status: 429 });

    }

    clients.set(ip, { ...parsed.data, ip, lastSeen: Date.now() });
    return NextResponse.json({ ok: true });

}

export async function GET() {

    return new NextResponse(null, { status: 404 });

}