import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


const getChannelById = publicProcedure
    .input(
        z.object({
            id: z.string(),
            viewerId: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {

        // find user by id
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: input.id,
            },
        });

        // if user not found, throw error
        if (!user) {
            throw new Error("User not found");
        }

        // get followers count
        const followers = await ctx.prisma.followEngagement.count({
            where: {
                followingId: user.id,
            },
        });

        // get followings count
        const followings = await ctx.prisma.followEngagement.count({
            where: {
                followerId: user.id,
            },
        });

        // check if viewer has followed the user
        let viewerHasFollowed = false;

        // add user and engagements to one object
        const userWithEngagements = { ...user, followers, followings };

        // if viewerId is provided, check if viewer has followed the user
        if (input.viewerId && input.viewerId !== "") {
            viewerHasFollowed = !!(await ctx.prisma.followEngagement.findFirst({
                where: {
                    followingId: user.id,
                    followerId: input.viewerId,
                },
            }));
        }

        // add viewer object to response
        const viewer = {
            hasFollowed: viewerHasFollowed,
        };

        return { user: userWithEngagements, viewer };
    });

export default getChannelById;