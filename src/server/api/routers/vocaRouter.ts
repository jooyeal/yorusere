import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createVocaInput,
  deleteVocaInput,
  getVacasInput,
  updateVocaInput,
} from "../scheme/vacaScheme";

export const vocaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createVocaInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.voca.create({
          data: {
            ...input,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  update: protectedProcedure
    .input(updateVocaInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.voca.update({
          where: {
            id: input.id,
          },
          data: {
            isChecked: !input.isChecked,
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
    .input(deleteVocaInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.voca.delete({
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
  getVocas: protectedProcedure
    .input(getVacasInput)
    .query(async ({ ctx, input }) => {
      try {
        const vocas = await ctx.prisma.voca.findMany({
          where: {
            isChecked:
              input.value === "all" ? {} : input.value === "not" ? false : true,
          },
        });
        return vocas;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
