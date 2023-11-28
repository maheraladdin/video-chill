import {
    createTRPCRouter,
} from "~/server/api/trpc";
import {
    addComment,
} from "~/server/api/procedures/comment";

const commentRouter = createTRPCRouter({
    addComment,
});

export default commentRouter;
