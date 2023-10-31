import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createExpenseInput,
  deleteExpenseInput,
  getAmountHaveToPayInput,
  getByMonthInput,
} from "../scheme/expenseScheme";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExpenseInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const dateTime = input.dateTime;
        dateTime.setTime(dateTime.getTime() + 9 * 60 * 60 * 1000);
        await ctx.prisma.expenses.create({
          data: {
            ...input,
            author:
              ctx.session.user.email === env.YORU_EMAIL
                ? "Y"
                : ctx.session.user.email === env.SERE_EMAIL
                ? "S"
                : "Y",
            dateTime: dateTime.toISOString(),
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
            person: input.person === "A" ? {} : input.person,
          },
          orderBy: {
            dateTime: "desc",
          },
        });

        const yoruExpenses = await ctx.prisma.expenses.findMany({
          where: {
            OR: [
              {
                dateTime: {
                  lt: new Date(endDate).toISOString(),
                  gte: new Date(startDate).toISOString(),
                },
                person: "T",
                author: "Y",
              },
              {
                dateTime: {
                  lt: new Date(endDate).toISOString(),
                  gte: new Date(startDate).toISOString(),
                },
                person: "S",
                author: "Y",
              },
            ],
          },
        });

        const sereExpenses = await ctx.prisma.expenses.findMany({
          where: {
            OR: [
              {
                dateTime: {
                  lt: new Date(endDate).toISOString(),
                  gte: new Date(startDate).toISOString(),
                },
                person: "T",
                author: "S",
              },
              {
                dateTime: {
                  lt: new Date(endDate).toISOString(),
                  gte: new Date(startDate).toISOString(),
                },
                person: "Y",
                author: "S",
              },
            ],
          },
          orderBy: {
            dateTime: "desc",
          },
        });

        const yoruTogetherExpense = yoruExpenses
          .filter((expense) => expense.person === "T")
          .reduce((prev, curr) => prev + curr.amount, 0);
        const yoruSereExpense = yoruExpenses
          .filter((expense) => expense.person === "S")
          .reduce((prev, curr) => prev + curr.amount, 0);
        const sereTogetherExpense = sereExpenses
          .filter((expense) => expense.person === "T")
          .reduce((prev, curr) => prev + curr.amount, 0);
        const sereYoruExpense = sereExpenses
          .filter((expense) => expense.person === "Y")
          .reduce((prev, curr) => prev + curr.amount, 0);

        const yoruTotalExpense = yoruExpenses.reduce(
          (prev, curr) => prev + curr.amount,
          0
        );

        const sereTotalExpense = sereExpenses.reduce(
          (prev, curr) => prev + curr.amount,
          0
        );

        const yoruAmountHaveToPay =
          60000 +
          Math.ceil(sereTogetherExpense / 2) +
          sereYoruExpense -
          (Math.ceil(yoruTogetherExpense / 2) + yoruSereExpense);

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

        return {
          expensesData,
          totalExpense,
          yoruTogetherExpense,
          yoruSereExpense,
          sereTogetherExpense,
          sereYoruExpense,
          yoruTotalExpense,
          sereTotalExpense,
          yoruAmountHaveToPay,
        };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
