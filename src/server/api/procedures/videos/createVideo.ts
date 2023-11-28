import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

const createVideo = protectedProcedure
    .input(z.object({ userId: z.string(), videoUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
        // add video cloudinary url to database
        return await ctx.prisma.video.create({
            data: {
                userId: input.userId,
                videoUrl: input.videoUrl,
                publish: false,
            },
        });
    });

export default createVideo;