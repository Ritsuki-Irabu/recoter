import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { analyzeThoughtLog } from "@/app/lib/gemini";
import type { PostLogRequest, PostLogResponse } from "@/app/types/api";

export const POST = async (req: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content }: PostLogRequest = await req.json();

    const log = await prisma.thoughtLog.create({
        data: {
            userId: session.user.id,
            content,
        },
    });

    const scores = await analyzeThoughtLog(content);

    const analysisResult = await prisma.analysisResult.create({
        data: {
            thoughtLogId: log.id,
            scores: {
                create: Object.entries(scores).map(([category, score]) => ({
                    category: category as any,
                    score,
                })),
            },
        },
    });

    return NextResponse.json<PostLogResponse>({
        success: true,
        logId: log.id,
    });
};
