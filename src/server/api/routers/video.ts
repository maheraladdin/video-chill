import {createTRPCRouter} from "~/server/api/trpc";
import {
    getRandomVideos,
    getVideosBySearch,
    getVideosByUserId,
    getVideoById,
    addVideoToPlaylist, publishVideo, deleteVideo, updateVideo, createVideo
} from "~/server/api/procedures/videos";

const videoRouter = createTRPCRouter({
  getVideoById,
  getRandomVideos,
  getVideosBySearch,
  getVideosByUserId,
  addVideoToPlaylist,
  publishVideo,
  deleteVideo,
  updateVideo,
  createVideo,
});

export default videoRouter;