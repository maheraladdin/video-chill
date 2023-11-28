import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";

const getPlaylistsByTitle = publicProcedure
    .input(
        z.object({
            title: z.string(),
            userId: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        let rawPlaylist = await ctx.prisma.playlist.findFirst({
            where: {
                title: input.title,
                userId: input.userId,
            },
            include: {
                user: true,
                videos: {
                    include: {
                        video: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (rawPlaylist === null || rawPlaylist === undefined) {
            rawPlaylist = await ctx.prisma.playlist.create({
                data: {
                    userId: input.userId,
                    title: input.title,
                },
                include: {
                    user: true,
                    videos: {
                        include: {
                            video: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
        }

        const followers = await ctx.prisma.followEngagement.count({
            where: {
                followingId: rawPlaylist.userId,
            },
        });

        const userWithFollowers = { ...rawPlaylist.user, followers };

        const videosWithUser = rawPlaylist.videos.map(({ video }) => ({
            ...video,
            author: video?.user,
        }));

        const videos = videosWithUser.map(({ author, ...video }) => video);
        const users = videosWithUser.map(({ user }) => user);

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

        const { user, videos: rawVideos, ...playlistInfo } = rawPlaylist;

        return {
            playlist: playlistInfo,
            videos: videosWithCounts,
            authors: users,
            user: userWithFollowers,
        };
    });

export default getPlaylistsByTitle;