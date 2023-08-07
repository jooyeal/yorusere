import { z } from "zod";

export const createWishListInput = z.object({
  title: z.string(),
});

export const updateWishListInput = z.object({
  id: z.string(),
  isChecked: z.boolean(),
});

export const deleteWishListInput = z.object({
  id: z.string(),
});

export type TcreateWishListInput = z.infer<typeof createWishListInput>;
export type TupdateWishListInput = z.infer<typeof updateWishListInput>;
export type TdeleteWishListInput = z.infer<typeof deleteWishListInput>;
