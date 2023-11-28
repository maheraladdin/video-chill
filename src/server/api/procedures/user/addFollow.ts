import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";

const addFollow = protectedProcedure
    .input(z.object({ followingId: z.string(), followerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const existingFollow = await ctx.prisma.followEngagement.findMany({
            where: {
                followingId: input.followingId,
                followerId: input.followerId,
                engagementType: EngagementType.FOLLOW,
            },
        });
        if (existingFollow.length > 0) {
            const deleteFollow = await ctx.prisma.followEngagement.deleteMany({
                where: {
                    followingId: input.followingId,
                    followerId: input.followerId,
                    engagementType: EngagementType.FOLLOW,
                },
            });
            return deleteFollow;
        } else {
            const follow = await ctx.prisma.followEngagement.create({
                data: {
                    followingId: input.followingId,
                    followerId: input.followerId,
                    engagementType: EngagementType.FOLLOW,
                },
            });
            return follow;
        }
    });

export default addFollow;