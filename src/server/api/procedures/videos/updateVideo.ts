import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {checkVideoOwnership} from "~/server/api/procedures/videos/sharedFunctions";


const updateVideo = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            userId: z.string(),
            title: z.string().optional(),
            description: z.string().optional(),
            thumbnailUrl: z.string().optional(),
        })
    ).mutation(async ({ ctx, input }) => {
        // Check if user owns video
        const video = await checkVideoOwnership(ctx, input.id, input.userId);

        // Update video
        return await ctx.prisma.video.update({
            where: {
                id: video.id,
            },
            data: {
                title: input.title ?? video.title,
                description: input.description ?? video.description,
                thumbnailUrl: input.thumbnailUrl ?? video.thumbnailUrl,
            },
        });
    });

export default updateVideo;