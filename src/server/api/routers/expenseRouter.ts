import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createExpenseInput,
  deleteExpenseInput,
  getByMonthInput,
} from "../scheme/expenseScheme";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { utcToZonedTime } from "date-fns-tz";

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
            dateTime: utcToZonedTime(new Date(input.dateTime), "Asia/Tokyo"),
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  delete: protectedProcedure
    .input(deleteExpenseInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.expenses.delete({
          where: {
            id: input.id,
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

        const expensesData =
          input.author === "T"
            ? expenses
            : input.author === "Y"
            ? expenses.filter((expense) => expense.author === "Y")
            : expenses.filter((expense) => expense.author === "S");

        const totalExpense = expensesData.reduce(
          (prev, curr) => prev + curr.amount,
          0
        );

        return { expensesData, totalExpense };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
