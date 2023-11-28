import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";

const addLikeAnnouncement = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {

        // Check if user has already liked the announcement
        const existingLike = await ctx.prisma.announcementEngagement.findMany({
            where: {
                announcementId: input.id,
                userId: input.userId,
                engagementType: EngagementType.LIKE,
            },
        });

        // Check if user has already disliked the announcement
        const existingDislike = await ctx.prisma.announcementEngagement.findMany({
            where: {
                announcementId: input.id,
                userId: input.userId,
                engagementType: EngagementType.DISLIKE,
            },
        });

        // If user has already disliked the announcement, remove the dislike
        if (existingDislike.length > 0) {
            await ctx.prisma.announcementEngagement.deleteMany({
                where: {
                    announcementId: input.id,
                    userId: input.userId,
                    engagementType: EngagementType.DISLIKE,
                },
            });
        }

        // If user has already liked the announcement, remove the like
        if (existingLike.length > 0) {
            return await ctx.prisma.announcementEngagement.deleteMany({
                where: {
                    announcementId: input.id,
                    userId: input.userId,
                    engagementType: EngagementType.LIKE,
                },
            });
        } else {
            // If user has not already liked the announcement, add the like
            return await ctx.prisma.announcementEngagement.create({
                data: {
                    announcementId: input.id,
                    userId: input.userId,
                    engagementType: EngagementType.LIKE,
                },
            });
        }
    });

export default addLikeAnnouncement;