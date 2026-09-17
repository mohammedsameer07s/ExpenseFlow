import { TxType } from "./types";

export const transactionOptions: Record<
  TxType,
  { categories: string[]; notes: string[] }
> = {
  expense: {
    categories: [
      "Food",
      "Transport",
      "Rent",
      "Bills",
      "Shopping",
      "Subscriptions",
      "Health",
      "Entertainment",
      "Other",
    ],
    notes: [
      "Groceries",
      "Restaurant",
      "Commute",
      "Monthly bill",
      "Online purchase",
      "Streaming",
      "Doctor visit",
      "General expense",
    ],
  },
  income: {
    categories: [
      "Salary",
      "Freelance",
      "Bonus",
      "Interest",
      "Gift",
      "Refund",
      "Other",
    ],
    notes: [
      "Monthly salary",
      "Client payment",
      "Performance bonus",
      "Bank interest",
      "Gift received",
      "Refund received",
      "General income",
    ],
  },
  transfer: {
    categories: [
      "Account Transfer",
      "Savings",
      "Cash Withdrawal",
      "Credit Card Payment",
      "Other",
    ],
    notes: [
      "Moved to savings",
      "Moved between accounts",
      "Cash withdrawal",
      "Paid credit card",
      "General transfer",
    ],
  },
};
