import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { analyzeThoughtLog } from "@/app/lib/gemini";
import type { PostLogRequest, PostLogResponse, GetLogsResponse } from "@/app/types/api";

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

export const GET = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.thoughtLog.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            analysisResult: {
                include: { scores: true },
            },
        },
    });

    const response: GetLogsResponse = {
        logs: logs.map((log) => ({
            id: log.id,
            content: log.content,
            createdAt: log.createdAt.toISOString(),
            scores: log.analysisResult
                ? {
                    analytical: log.analysisResult.scores.find((s) => s.category === "analytical")?.score ?? 0,
                    strategic: log.analysisResult.scores.find((s) => s.category === "strategic")?.score ?? 0,
                    exploratory: log.analysisResult.scores.find((s) => s.category === "exploratory")?.score ?? 0,
                    reflective: log.analysisResult.scores.find((s) => s.category === "reflective")?.score ?? 0,
                    social: log.analysisResult.scores.find((s) => s.category === "social")?.score ?? 0,
                }
                : null,
        })),
    };

    return NextResponse.json(response);
};