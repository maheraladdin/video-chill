import {protectedProcedure} from "~/server/api/trpc";
import { z } from "zod";


const addAnnouncement = protectedProcedure
    .input(
        z.object({
            userId: z.string(),
            message: z.string().min(5).max(200),
        })
    )
    .mutation(async ({ ctx, input }) => {
        // create new announcement using message and userId
        await ctx.prisma.announcement.create({
            data: {
                userId: input.userId,
                message: input.message,
            },
        });
    });

export default addAnnouncement;