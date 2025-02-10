import { z } from "zod";

export const TransactionSchema = z.object({
  espee_amount: z.number().min(1, "Amount must be at least 1"),
  destination_currency: z.string().min(3, "Invalid currency"),
  bank_account: z.object({
    bank_id: z.string().or(z.number()),
    account_number: z.string().length(10, "Account number must be 10 digits"),
  }),
});


