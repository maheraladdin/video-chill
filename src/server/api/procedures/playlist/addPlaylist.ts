import {protectedProcedure} from "~/server/api/trpc";
import { z } from "zod";

const addPlaylist = protectedProcedure
    .input(
        z.object({
            title: z.string(),
            userId: z.string(),
            description: z.string().min(5).max(50).optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const playlist = await ctx.prisma.playlist.create({
            data: {
                title: input.title,
                userId: input.userId,
                description: input.description,
            },
        });

        return playlist;
    });

export default addPlaylist;