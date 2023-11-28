import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

type Context = {
    prisma: PrismaClient;
};

/**
 * Checks if the video exists and if the user owns it
 * @param ctx
 * @param id
 * @param userId
 */
export const checkVideoOwnership = async (
    ctx: Context,
    id: string,
    userId: string
) => {
    const video = await ctx.prisma.video.findUnique({
        where: {
            id,
        },
    });
    if (!video || video.userId !== userId) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Video not found",
        });
    }
    return video;
};