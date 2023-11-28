import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


const getPlaylistsByUserId = publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
        // get all playlists with user info ,and videos by user id
        const rawPlaylists = await ctx.prisma.playlist.findMany({
            where: {
                userId: input,
            },
            include: {
                user: true,
                videos: {
                    include: {
                        video: true,
                    },
                },
            },
        });

        // reconstruct the data to add video count and playlist thumbnail (first video in playlist)
        const playlists = await Promise.all(
            rawPlaylists.map(async (playlist) => {
                const videoCount = await ctx.prisma.playlistHasVideo.count({
                    where: {
                        playlistId: playlist.id,
                    },
                });

                const firstVideoInPlaylist =
                    await ctx.prisma.playlistHasVideo.findFirst({
                        where: {
                            playlistId: playlist.id,
                        },
                        include: {
                            video: {
                                select: {
                                    thumbnailUrl: true,
                                },
                            },
                        },
                    });

                return {
                    ...playlist,
                    videoCount,
                    playlistThumbnail: firstVideoInPlaylist?.video?.thumbnailUrl,
                };
            })
        );

        return playlists;
    });

export default getPlaylistsByUserId;