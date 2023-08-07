import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createExpenseInput, getByMonthInput } from "../scheme/expenseScheme";
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
                : "Y",
            dateTime: new Date(input.dateTime).toISOString(),
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getByMonth: protectedProcedure
    .input(getByMonthInput)
    .query(async ({ input, ctx }) => {
      try {
        const targetDate = input.date;
        const targetYear = new Date(targetDate).getFullYear();
        const targetMonth = new Date(targetDate).getMonth() + 1;
        const startDate = new Date(`${targetYear}-${targetMonth}-1`);
        const endDate = new Date(`${targetYear}-${targetMonth + 1}-1`);

        const expenses = await ctx.prisma.expenses.findMany({
          where: {
            dateTime: {
              lt: new Date(endDate).toISOString(),
              gte: new Date(startDate).toISOString(),
            },
            person: input.person,
          },
        });
        return expenses;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
