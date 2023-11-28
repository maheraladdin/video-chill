import {
  createTRPCRouter,
} from "~/server/api/trpc";
import {
    addPlaylist,
    getPlaylistById, getPlaylistsByTitle,
    getPlaylistsByUserId,
    getSavePlaylistData
} from "~/server/api/procedures/playlist";

const playlistRouter = createTRPCRouter({
  getPlaylistById,
  getSavePlaylistData,
  getPlaylistsByUserId,
  addPlaylist,
  getPlaylistsByTitle,
});

export default playlistRouter;
