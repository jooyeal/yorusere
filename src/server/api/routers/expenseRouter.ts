import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createExpenseInput } from "../scheme/expenseScheme";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExpenseInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.expenses.create({
          data: {
            ...input,
            author:
              ctx.session.user.email === env.YORU_EMAIL
                ? "Y"
                : ctx.session.user.email === env.SERE_EMAIL
                ? "S"
                : "Q",
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
