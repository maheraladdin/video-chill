import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


const getUserFollowings = publicProcedure
    .input(
        z.object({
            id: z.string(),
            viewerId: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {

        // Get user by id with followings list (the list of users that the user follows)
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: input.id,
            },
            include: {
                followings: {
                    include: {
                        following: {
                            include: {
                                followings: true,
                            },
                        },
                    },
                },
            },
        });

        // Ensure the user exists
        if (!user) {
            return null;
        }

        // Get a list of all followings
        const followings = user.followings;

        // add a field to each following that indicates whether the viewer has followed the following
        const followingsWithViewerFollowedStatus = await Promise.all(
            followings.map(async (following) => {
                let viewerHasFollowed = false;
                if (input.viewerId && input.viewerId !== "") {
                    viewerHasFollowed = !!(await ctx.prisma.followEngagement.findFirst({
                        where: {
                            followingId: following.following.id,
                            followerId: input.viewerId,
                        },
                    }));
                }
                return { ...following, viewerHasFollowed };
            })
        );

        return { ...user, followings: followingsWithViewerFollowedStatus };
    });

export default getUserFollowings;