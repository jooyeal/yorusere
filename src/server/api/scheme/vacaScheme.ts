import { z } from "zod";

export const createVocaInput = z.object({
  voca: z.string(),
  mean: z.string(),
});

export const updateVocaInput = z.object({
  id: z.string(),
  isChecked: z.boolean(),
});

export const deleteVocaInput = z.object({
  id: z.string(),
});

export const getVacasInput = z.object({
  value: z.enum(["all", "not", "ok"]),
});

export type TcreateVocaInput = z.infer<typeof createVocaInput>;
export type TupdateVocaInput = z.infer<typeof updateVocaInput>;
export type TdeleteVocaInput = z.infer<typeof deleteVocaInput>;
export type TgetVacasInput = z.infer<typeof getVacasInput>;
