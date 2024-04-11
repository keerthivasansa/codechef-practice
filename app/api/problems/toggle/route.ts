import prisma from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    const code = req.nextUrl.searchParams.get("code");
    if (!code)
        return new Response("Missing problem `code` in query params.", {
            status: 401
        })
    await prisma.$queryRaw`UPDATE "Problem" SET completed = (NOT completed::boolean) WHERE code = ${code}`
    return Response.json({ ok: true })
};