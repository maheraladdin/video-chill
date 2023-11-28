import {publicProcedure} from "~/server/api/trpc";
import {EngagementType} from "@prisma/client";
import {z} from "zod";

const getVideoById = publicProcedure
    .input(
        z.object({
            id: z.string(),
            viewerId: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {

        // step 1: get video by id with user , comments included in the response ,and users of comments
        const rawVideo = await ctx.prisma.video.findUnique({
            where: {
                id: input.id,
            },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        // step 2: if video not found throw error
        if (!rawVideo) {
            throw new Error("Video not found");
        }

        // step 3: extract user ,comments ,video from rawVideo
        const { user, comments, ...video } = rawVideo;

        // step 4: get followers ,likes ,dislikes ,views of the video
        const followers = await ctx.prisma.followEngagement.count({
            where: {
                followerId: video.userId,
            },
        });
        const likes = await ctx.prisma.videoEngagement.count({
            where: {
                videoId: video.id,
                engagementType: EngagementType.LIKE,
            },
        });
        const dislikes = await ctx.prisma.videoEngagement.count({
            where: {
                videoId: video.id,
                engagementType: EngagementType.DISLIKE,
            },
        });
        const views = await ctx.prisma.videoEngagement.count({
            where: {
                videoId: video.id,
                engagementType: EngagementType.VIEW,
            },
        });

        const userWithFollowers = { ...user, followers };

        const videoWithLikesDislikesViews = { ...video, likes, dislikes, views };

        const commentsWithUsers = comments.map(({ user, ...comment }) => ({
            user,
            comment,
        }));

        // step 5: check if viewer has liked ,or disliked the video ,or followed the user
        let [viewerHasLiked, viewerHasDisliked, viewerHasFollowed] = Array(3).fill(false);

        if (input.viewerId) {

            viewerHasLiked = !!(await ctx.prisma.videoEngagement.findFirst({
                where: {
                    videoId: input.id,
                    userId: input.viewerId,
                    engagementType: EngagementType.LIKE,
                },
            }));

            viewerHasDisliked = !!(await ctx.prisma.videoEngagement.findFirst({
                where: {
                    videoId: input.id,
                    userId: input.viewerId,
                    engagementType: EngagementType.DISLIKE,
                },
            }));

            viewerHasFollowed = !!(await ctx.prisma.followEngagement.findFirst({
                where: {
                    followingId: rawVideo.userId,
                    followerId: input.viewerId,
                },
            }));

        } else {
            [viewerHasLiked, viewerHasDisliked, viewerHasFollowed] = Array(3).fill(false)
        }

        const viewer = {
            hasLiked: viewerHasLiked,
            hasDisliked: viewerHasDisliked,
            hasFollowed: viewerHasFollowed,
        };

        return {
            video: videoWithLikesDislikesViews,
            user: userWithFollowers,
            comments: commentsWithUsers,
            viewer,
        };
    });

export default getVideoById;