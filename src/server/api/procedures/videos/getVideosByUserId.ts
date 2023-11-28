import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";


const getVideosByUserId = publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
        // get all videos with user info by user id
        const videosWithUser = await ctx.prisma.video.findMany({
            where: {
                userId: input,
                publish: true,
            },
            include: {
                user: true,
            },
        });

        // reconstruct the data into two arrays of videos and users
        const videos = videosWithUser.map(({ user, ...video }) => video);
        const users = videosWithUser.map(({ user }) => user);

        // get the view count for each video
        const videosWithCounts = await Promise.all(
            videos.map(async (video) => {
                const views = await ctx.prisma.videoEngagement.count({
                    where: {
                        videoId: video.id,
                        engagementType: EngagementType.VIEW,
                    },
                });
                return {
                    ...video,
                    views,
                };
            })
        );

        return { videos: videosWithCounts, users: users };
    });

export default getVideosByUserId;