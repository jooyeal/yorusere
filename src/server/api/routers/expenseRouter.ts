import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createExpenseInput } from "../scheme/expenseScheme";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExpenseInput)
    .mutation(async ({ input }) => {
      try {
        await prisma.expenses.create({
          data: { ...input },
        });
      } catch (e: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
