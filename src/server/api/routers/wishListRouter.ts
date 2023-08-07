import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createWishListInput,
  deleteWishListInput,
  updateWishListInput,
} from "../scheme/wishListScheme";

export const wishListRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createWishListInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.wishList.create({
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
    .input(updateWishListInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.wishList.update({
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
    .input(deleteWishListInput)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.wishList.delete({
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
  getWishList: protectedProcedure.query(async ({ ctx }) => {
    try {
      const wishList = await ctx.prisma.wishList.findMany();
      return wishList;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
