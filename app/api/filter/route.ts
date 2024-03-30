import prisma from "@/app/lib/prisma";
import { GlobalFilter } from "@prisma/client";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const setting: GlobalFilter = await req.json();
    await prisma.globalFilter.update({
        where: {
            settingId: setting.settingId,
        },
        data: setting,
    })
    return Response.json({ ok: true });
}