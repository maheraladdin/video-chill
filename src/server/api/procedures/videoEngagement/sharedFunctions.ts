import { type PrismaClient, EngagementType } from "@prisma/client";

type Context = {
    prisma: PrismaClient;
};

export async function getOrCreatePlaylist(
    ctx: Context,
    title: string,
    userId: string
) {
    //    step1: check if playlist exists
    let playlist = await ctx.prisma.playlist.findFirst({
        where: { title, userId },
    });

    //    step2: if playlist does not exist, create it
    if (playlist === null || playlist === undefined) {
        playlist = await ctx.prisma.playlist.create({
            data: { title, userId },
        });
    }

    return playlist;
}

export async function deleteEngagementIfExists(
    ctx: Context,
    id: string,
    userId: string,
    type: EngagementType
) {
    //    step1: check if engagement exists
    const existingEngagement = await ctx.prisma.videoEngagement.findMany({
        where: { videoId: id, userId, engagementType: type },
    });

    //    step2: if engagement exists, delete it
    if (existingEngagement.length > 0) {
        await ctx.prisma.videoEngagement.deleteMany({
            where: { videoId: id, userId, engagementType: type },
        });
    }
}

export async function createEngagement(
    ctx: Context,
    id: string,
    userId: string,
    type: EngagementType
) {
    //    step1: create the engagement
    return await ctx.prisma.videoEngagement.create({
        data: { videoId: id, userId, engagementType: type },
    });
}