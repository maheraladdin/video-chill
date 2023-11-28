import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";


const getPlaylistById = publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {

        // get playlist by id with videos and user info
        const rawPlaylist = await ctx.prisma.playlist.findUnique({
            where: {
                id: input,
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

        // if playlist not found, throw error
        if (!rawPlaylist) {
            throw new Error("Playlist not found");
        }

        // get followers count of playlist author
        const followers = await ctx.prisma.followEngagement.count({
            where: {
                followingId: rawPlaylist.userId,
            },
        });

        // add followers count to user object
        const userWithFollowers = { ...rawPlaylist.user, followers };

        // get videos with author info
        const videosWithUser = rawPlaylist.videos.map(({ video }) => ({
            ...video,
            author: video?.user,
        }));

        // get videos and users separately
        const videos = videosWithUser.map(({ author, ...video }) => video);
        const users = videosWithUser.map(({ user }) => user);

        // get views count for each video
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

        // get playlist info without videos and user info
        const { user, videos: rawVideos, ...playlistInfo } = rawPlaylist;

        return {
            playlist: playlistInfo,
            videos: videosWithCounts,
            authors: users,
            user: userWithFollowers,
        };
    });

export default getPlaylistById;