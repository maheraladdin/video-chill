import { createTRPCRouter } from "~/server/api/trpc";
import {
  announcementRouter,
  commentRouter,
  playlistRouter,
  userRouter,
  videoEngagementRouter,
  videoRouter
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  video: videoRouter,
  videoEngagement: videoEngagementRouter,
  announcement: announcementRouter,
  comment: commentRouter,
  playlist: playlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
