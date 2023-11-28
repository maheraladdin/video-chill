import {protectedProcedure} from "~/server/api/trpc";
import {checkVideoOwnership} from "~/server/api/procedures/videos/sharedFunctions";
import { z } from "zod";

const deleteVideo = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {

        // check if user owns video and get video
        const video = await checkVideoOwnership(ctx, input.id, input.userId);

        // delete video
        return await ctx.prisma.video.delete({
            where: {
                id: video.id,
            },
        });

    });

export default deleteVideo;