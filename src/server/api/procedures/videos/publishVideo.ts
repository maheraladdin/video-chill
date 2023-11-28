import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {checkVideoOwnership} from "~/server/api/procedures/videos/sharedFunctions";



const publishVideo = protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input: {id, userId} }) => {

        // check if user owns video and get video
        const video = await checkVideoOwnership(ctx, id, userId);

        // toggle video publish status
        return await ctx.prisma.video.update({
            where: {
                id: video.id,
            },
            data: {
                publish: !video.publish,
            },
        });
    });

export default publishVideo;