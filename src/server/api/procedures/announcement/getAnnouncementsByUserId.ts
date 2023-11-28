import {publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {EngagementType} from "@prisma/client";

const getAnnouncementsByUserId = publicProcedure
    .input(
        z.object({
            id: z.string(),
            viewerId: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {
        // get all announcements with users by user id
        const announcementsWithUser = await ctx.prisma.announcement.findMany({
            where: {
                userId: input.id,
            },
            include: {
                user: true,
            },
        });

        // get all announcements
        const announcements = announcementsWithUser.map(
            ({ user, ...annoucement }) => annoucement
        );

        // get all users
        const user = announcementsWithUser.map(({ user }) => user);

        // get all likes and dislikes for each announcement
        const announcementsWithEngagements = await Promise.all(

            // get all likes and dislikes for each announcement
            announcements.map(async (annoucement) => {
                const likes = await ctx.prisma.announcementEngagement.count({
                    where: {
                        announcementId: annoucement.id,
                        engagementType: EngagementType.LIKE,
                    },
                });

                const dislikes = await ctx.prisma.announcementEngagement.count({
                    where: {
                        announcementId: annoucement.id,
                        engagementType: EngagementType.DISLIKE,
                    },
                });


                let viewerHasLiked = false;
                let viewerHasDisliked = false;

                if (input.viewerId && input.viewerId !== "") {
                    // check if viewer has liked or disliked
                    viewerHasLiked =
                        !!(await ctx.prisma.announcementEngagement.findFirst({
                            where: {
                                announcementId: annoucement.id,
                                userId: input.viewerId,
                                engagementType: EngagementType.LIKE,
                            },
                        }));

                    viewerHasDisliked =
                        !!(await ctx.prisma.announcementEngagement.findFirst({
                            where: {
                                announcementId: annoucement.id,
                                userId: input.viewerId,
                                engagementType: EngagementType.DISLIKE,
                            },
                        }));
                }

                const viewer = {
                    hasLiked: viewerHasLiked,
                    hasDisliked: viewerHasDisliked,
                };

                return {
                    ...annoucement,
                    likes,
                    dislikes,
                    viewer,
                };
            })
        );

        return { announcements: announcementsWithEngagements, user };
    });

export default getAnnouncementsByUserId;