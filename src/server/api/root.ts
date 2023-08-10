import { createTRPCRouter } from "~/server/api/trpc";
import { expenseRouter } from "./routers/expenseRouter";
import { wishListRouter } from "./routers/wishListRouter";
import { vocaRouter } from "./routers/vocaRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  expense: expenseRouter,
  wishlist: wishListRouter,
  voca: vocaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
