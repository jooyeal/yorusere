import { z } from "zod";

export const createExpenseInput = z.object({
  title: z.string(),
  amount: z.number(),
  dateTime: z.date(),
  type: z.enum(["F", "L", "R", "O"]),
  content: z.string().optional().nullable(),
  person: z.enum(["S", "Y", "T"]),
  author: z.enum(["S", "Y"]),
});

export type TcreateExpenseInput = z.infer<typeof createExpenseInput>;
