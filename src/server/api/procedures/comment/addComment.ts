import {protectedProcedure} from "~/server/api/trpc";
import { z } from "zod";


const addComment = protectedProcedure
    .input(
        z.object({
            videoId: z.string(),
            userId: z.string(),
            message: z.string().max(200).min(5),
        })
    )
    .mutation(async ({ ctx, input }) => {
        // create comment
        await ctx.prisma.comment.create({
            data: {
                videoId: input.videoId,
                userId: input.userId,
                message: input.message,
            },
        });
        // refetch comments
        return await ctx.prisma.comment.findMany({
            where: {
                videoId: input.videoId,
            },
        });
    });

export default addComment;