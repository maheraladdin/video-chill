import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {getOrCreatePlaylist, deleteEngagementIfExists, createEngagement} from "./index";
import { EngagementType } from "@prisma/client";

const addDislike = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        //   step1: delete like engagement if exists
        await deleteEngagementIfExists(
            ctx,
            input.id,
            input.userId,
            EngagementType.LIKE
        );

        //  step2: check if dislike engagement exists
        const existingDislike = await ctx.prisma.videoEngagement.findMany({
            where: {
                videoId: input.id,
                userId: input.userId,
                engagementType: EngagementType.DISLIKE,
            },
        });

        // step3: get or create playlist of liked videos
        const playlist = await getOrCreatePlaylist(
            ctx,
            "Liked Videos",
            input.userId
        );

        // step4: delete disliked video from playlist of liked videos
        await ctx.prisma.playlistHasVideo.deleteMany({
            where: {
                playlistId: playlist.id,
                videoId: input.id,
            },
        });


        if (existingDislike.length > 0) {
            // step5: if dislike engagement exists, delete it
            return await deleteEngagementIfExists(
                ctx,
                input.id,
                input.userId,
                EngagementType.DISLIKE
            );
        } else {
            // step6: if dislike engagement does not exist, create it
            return await createEngagement(
                ctx,
                input.id,
                input.userId,
                EngagementType.DISLIKE
            );
        }
    });

export default addDislike;