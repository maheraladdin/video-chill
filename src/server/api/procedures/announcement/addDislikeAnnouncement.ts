import {protectedProcedure} from "~/server/api/trpc";
import { EngagementType } from "@prisma/client";
import { z } from "zod";

const addDislikeAnnouncement = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        // Check if user has already disliked the announcement
        const existingDislike = await ctx.prisma.announcementEngagement.findMany({
            where: {
                announcementId: input.id,
                userId: input.userId,
                engagementType: EngagementType.DISLIKE,
            },
        });

        // Check if user has already liked the announcement
        const existingLike = await ctx.prisma.announcementEngagement.findMany({
            where: {
                announcementId: input.id,
                userId: input.userId,
                engagementType: EngagementType.LIKE,
            },
        });

        // If user has already liked the announcement, remove the like
        if (existingLike.length > 0) {
            await ctx.prisma.announcementEngagement.deleteMany({
                where: {
                    announcementId: input.id,
                    userId: input.userId,
                    engagementType: EngagementType.LIKE,
                },
            });
        }

        // If user has already disliked the announcement, remove the dislike
        if (existingDislike.length > 0) {
            return await ctx.prisma.announcementEngagement.deleteMany({
                    where: {
                        announcementId: input.id,
                        userId: input.userId,
                        engagementType: EngagementType.DISLIKE,
                    },
                });
        } else {
            // If user has not already disliked the announcement, add the dislike
            return await ctx.prisma.announcementEngagement.create({
                data: {
                    announcementId: input.id,
                    userId: input.userId,
                    engagementType: EngagementType.DISLIKE,
                },
            });
        }
    });

export default addDislikeAnnouncement;