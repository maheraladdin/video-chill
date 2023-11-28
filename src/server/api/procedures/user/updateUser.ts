import {protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

const updateUser = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            name: z.string().optional(),
            email: z.string().optional(),
            image: z.string().optional(),
            backgroundImage: z.string().optional(),
            handle: z.string().optional(),
            description: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: input.id,
            },
        });
        if (!user || user.id !== input.id) {
            throw new Error("User not found or you're not authorized to delete it");
        }
        const updatedUser = await ctx.prisma.user.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name ?? user.name,
                email: input.email ?? user.email,
                image: input.image ?? user.image,
                backgroundImage: input.backgroundImage ?? user.backgroundImage,
                handle: input.handle ?? user.handle,
                description: input.description ?? user.description,
            },
        });
        return updatedUser;
    });

export default updateUser;