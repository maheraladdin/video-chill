import {createTRPCRouter} from "~/server/api/trpc";
import {addLike, addDislike, addViewCount} from "../procedures/videoEngagement";

const videoEngagementRouter = createTRPCRouter({
  addViewCount,
  addLike,
  addDislike,
});

export default videoEngagementRouter;
