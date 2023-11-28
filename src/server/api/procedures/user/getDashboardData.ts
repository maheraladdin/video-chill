import {protectedProcedure} from "~/server/api/trpc";
import {EngagementType} from "@prisma/client";
import {z} from "zod";


const getDashboardData = protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
        // get user with videos by id
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: input,
            },
            include: {
                videos: true,
            },
        });

        // if user not found, throw error
        if (!user) {
            throw new Error("User not found");
        }

        // get likes, dislikes, and views for each video
        const videosWithCounts = await Promise.all(
            user.videos.map(async (video) => {
                const likes = await ctx.prisma.videoEngagement.count({
                    where: {
                        videoId: video.id,
                        engagementType: EngagementType.LIKE,
                    },
                });
                const dislikes = await ctx.prisma.videoEngagement.count({
                    where: {
                        videoId: video.id,
                        engagementType: EngagementType.DISLIKE,
                    },
                });
                const views = await ctx.prisma.videoEngagement.count({
                    where: {
                        videoId: video.id,
                        engagementType: EngagementType.VIEW,
                    },
                });
                return {
                    ...video,
                    likes,
                    dislikes,
                    views,
                };
            })
        );

        // calculate total likes, views, and followers
        const totalLikes = videosWithCounts.reduce(
            (total, video) => total + video.likes,
            0
        );
        const totalViews = videosWithCounts.reduce(
            (total, video) => total + video.views,
            0
        );
        const totalFollowers = await ctx.prisma.followEngagement.count({
            where: {
                followingId: user.id,
            },
        });

        return {
            user,
            totalFollowers,
            videos: videosWithCounts,
            totalLikes,
            totalViews,
        };
    });

export default getDashboardData;