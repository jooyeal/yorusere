import { z } from "zod";

export const createExpenseInput = z.object({
  title: z.string(),
  amount: z.number(),
  dateTime: z.date(),
  type: z.enum(["F", "L", "R", "O"]),
  content: z.string().optional().nullable(),
  person: z.enum(["S", "Y", "T"]),
});

export const deleteExpenseInput = z.object({
  id: z.string(),
});

export const getByMonthInput = z.object({
  date: z.date(),
  person: z.enum(["S", "Y", "T", "A"]),
  author: z.enum(["S", "Y", "T", "A"]),
});

export const getAmountHaveToPayInput = z.object({
  date: z.date(),
});

export type TcreateExpenseInput = z.infer<typeof createExpenseInput>;
export type TdeleteExpenseInput = z.infer<typeof deleteExpenseInput>;
export type TgetByMonthInput = z.infer<typeof getByMonthInput>;
export type TgetAmountHaveToPayInput = z.infer<typeof getAmountHaveToPayInput>;
