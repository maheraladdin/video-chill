import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {getOrCreatePlaylist, createEngagement} from "./index";
import { EngagementType } from "@prisma/client";

const addViewCount = publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {

        //    step1: check if user is authenticated
        if (input.userId && input.userId !== "") {
            //    step1.1: get or create playlist of viewed videos (history)
            const playlist = await getOrCreatePlaylist(
                ctx,
                "History",
                input.userId
            );

            //   step1.2: check if the video exists in the database
            const video = await ctx.prisma.video.findUnique({
                where: { id: input.id },
            });

            if (!video) {
                throw new Error("Video does not exist");
            }

            //    step1.3: add the video to the playlist of viewed videos (history)
            await ctx.prisma.playlistHasVideo.create({
                data: { playlistId: playlist.id, videoId: input.id },
            });
        }
        //    step2: create and return the view engagement
        return await createEngagement(
            ctx,
            input.id,
            input.userId,
            EngagementType.VIEW
        );
    });

export default addViewCount;