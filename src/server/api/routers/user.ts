import {
  createTRPCRouter,
} from "~/server/api/trpc";
import {addFollow, getChannelById, getDashboardData, getUserFollowings, updateUser} from "~/server/api/procedures/user";

const userRouter = createTRPCRouter({
  getDashboardData,
  getUserFollowings,
  getChannelById,
  addFollow,
  updateUser,
});

export default userRouter;
