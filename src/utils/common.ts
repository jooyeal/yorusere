import { ExpenseType, PersonType } from "@prisma/client";

export const convertExpenseType = (type: ExpenseType) => {
  switch (type) {
    case "F":
      return "Food";
    case "L":
      return "Liquor";
    case "O":
      return "Other";
    case "R":
      return "Restaurant";
  }
};

export const convertPersonType = (type: PersonType) => {
  switch (type) {
    case "S":
      return "Serena";
    case "T":
      return "Together";
    case "Y":
      return "Yoru";
    case "A":
      return "Total";
  }
};
