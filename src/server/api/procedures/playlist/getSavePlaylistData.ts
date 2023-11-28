import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

const getSavePlaylistData = protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
        return await ctx.prisma.playlist.findMany({
            where: {
                userId: input,
                NOT: [{ title: "Liked Videos" }, { title: "History" }],
            },
            include: {
                videos: {
                    include: {
                        video: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    });

export default getSavePlaylistData;