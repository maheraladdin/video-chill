import {publicProcedure} from "~/server/api/trpc";
import {EngagementType} from "@prisma/client";
import {z} from "zod";

const getVideosBySearch = publicProcedure
    .input(z.object({
        title: z.string(),
        take: z.optional(z.number().default(10)),
    }))
    .query(async ({ ctx, input }) => {
        // step 1: get all videos that are published
        const {title, take} = input;
        const videosWithUser = await ctx.prisma.video.findMany({
            where: {
                publish: true,
                OR: {
                    description: {
                        contains: title,
                    },
                    title: {
                        contains: title,
                    }
                }
            },
            take,
            include: {
                user: true,
            },
        });

        // Split videos and users into separate arrays
        const videos = videosWithUser.map(({ user, ...video }) => video);
        const users = videosWithUser.map(({ user }) => user);

        // Add view counts to videos
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

        return { videos: videosWithCounts, users };
    });


export default getVideosBySearch;