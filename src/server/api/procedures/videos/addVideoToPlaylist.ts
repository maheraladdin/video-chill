import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";


const addVideoToPlaylist = protectedProcedure
    .input(
        z.object({
            playlistId: z.string(),
            videoId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        // check if playlist already has a video with input video id
        const playlistAlreadyHasVideo =
            await ctx.prisma.playlistHasVideo.findMany({
                where: {
                    playlistId: input.playlistId,
                    videoId: input.videoId,
                },
            });

        if (playlistAlreadyHasVideo.length > 0) {
            // Remove the video from the playlist
            return await ctx.prisma.playlistHasVideo.deleteMany({
                where: {
                    playlistId: input.playlistId,
                    videoId: input.videoId,
                },
            });
        } else {
            // Add the video to the playlist
            return await ctx.prisma.playlistHasVideo.create({
                data: {
                    playlistId: input.playlistId,
                    videoId: input.videoId,
                },
            });
        }
    });

export default addVideoToPlaylist;