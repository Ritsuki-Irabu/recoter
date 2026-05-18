import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { calculateAgilityScore } from "@/app/lib/agility-logic";
import type { AgilityResponse } from "@/app/types/api";

const getAgilityScore = async (userId: string): Promise<AgilityResponse> => {
    const allResults = await prisma.analysisScore.findMany({
        where: { analysis: { log: { userId } } },
        include: { analysis: { include: { log: true } } },
    });

    const scoresByLog = allResults.reduce((acc, s) => {
        const logId = s.analysis.log.id;
        if (!acc[logId]) acc[logId] = { analytical: 0, strategic: 0, exploratory: 0, reflective: 0, social: 0 };
        acc[logId][s.category as keyof typeof acc[typeof logId]] = s.score;
        return acc;
    }, {} as Record<string, { analytical: number; strategic: number; exploratory: number; reflective: number; social: number }>);

    return calculateAgilityScore(Object.values(scoresByLog));
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await req.json();

    await prisma.thoughtLog.update({
        where: { id, userId: session.user.id },
        data: { content },
    });

    const agility = await getAgilityScore(session.user.id);
    return NextResponse.json<AgilityResponse>(agility);
};

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.thoughtLog.delete({
        where: { id, userId: session.user.id },
    });

    const agility = await getAgilityScore(session.user.id);
    return NextResponse.json<AgilityResponse>(agility);
};
