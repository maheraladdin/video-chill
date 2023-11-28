import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {getOrCreatePlaylist, deleteEngagementIfExists, createEngagement} from "./index";
import { EngagementType } from "@prisma/client";

const addLike = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {

        //    step1: delete dislike if exists
        await deleteEngagementIfExists(
            ctx,
            input.id,
            input.userId,
            EngagementType.DISLIKE
        );

        //    step2: check if like exists
        const existingLike = await ctx.prisma.videoEngagement.findMany({
            where: {
                videoId: input.id,
                userId: input.userId,
                engagementType: EngagementType.LIKE,
            },
        });

        //    step3: get or create playlist of liked videos
        const playlist = await getOrCreatePlaylist(
            ctx,
            "Liked Videos",
            input.userId
        );

        //    step4: if user has already liked the video
        if (existingLike.length > 0) {

            //  step4.1: delete the like engagement
            await ctx.prisma.playlistHasVideo.deleteMany({
                where: {
                    playlistId: playlist.id,
                    videoId: input.id,
                },
            });

            //  step4.2: remove the video from the playlist of liked videos
            return await deleteEngagementIfExists(
                ctx,
                input.id,
                input.userId,
                EngagementType.LIKE
            );

        }
        else //   step5: if user has not liked the video
        {
            //  step5.1: add the video to the playlist of liked videos
            await ctx.prisma.playlistHasVideo.create({
                data: { playlistId: playlist.id, videoId: input.id },
            });

            //  step5.2: create the like engagement
            return await createEngagement(
                ctx,
                input.id,
                input.userId,
                EngagementType.LIKE
            );
        }
    });

export default addLike;