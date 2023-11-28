import {
  createTRPCRouter,
} from "~/server/api/trpc";
import {
    addAnnouncement,
    addDislikeAnnouncement,
    addLikeAnnouncement,
    getAnnouncementsByUserId
} from "~/server/api/procedures/announcement";

const announcementRouter = createTRPCRouter({
  getAnnouncementsByUserId,
  addLikeAnnouncement,
  addDislikeAnnouncement,
  addAnnouncement,
});

export default announcementRouter;