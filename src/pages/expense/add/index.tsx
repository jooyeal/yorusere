import {
  Button,
  Container,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import React from "react";
import { useForm } from "react-hook-form";
import { TcreateExpenseInput } from "~/server/api/scheme/expenseScheme";
import { api } from "~/utils/api";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function ExpenseAdd() {
  const { register, setValue, handleSubmit } = useForm<TcreateExpenseInput>();
  const { mutate } = api.expense.create.useMutation();
  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        amount: Number(data.amount),
      },
      {
        onSuccess: () => {
          notifications.show({ message: "New expense is created!" });
          router.push("/");
        },
        onError: (e) => {
          notifications.show({
            message:
              e.data?.code === "BAD_REQUEST"
                ? "Please check required fields"
                : e.message,
            color: "red",
          });
        },
      }
    );
  });
  return (
    <form onSubmit={onSubmit}>
      <Container>
        <Stack>
          <Title order={3}>Create new expense</Title>
          <TextInput {...register("title")} label="Title" required />
          <TextInput
            {...register("amount")}
            type="number"
            label="Amount"
            required
          />
          <DateTimePicker
            {...register("dateTime")}
            label="Pick date and time"
            onChange={(e) => setValue("dateTime", e as Date)}
            required
          />
          <Select
            {...register("type")}
            label="Type"
            data={[
              { label: "Food", value: "F" },
              { label: "Liquor", value: "L" },
              { label: "Restaurant", value: "R" },
              { label: "Other", value: "O" },
            ]}
            onChange={(e) => setValue("type", e as "F" | "L" | "R" | "O")}
            required
          />
          <Textarea {...register("content")} label="Content" />
          <Select
            {...register("person")}
            label="Person"
            data={[
              { label: "Serena", value: "S" },
              { label: "Yoru", value: "Y" },
              { label: "Together", value: "T" },
            ]}
            onChange={(e) => setValue("person", e as "S" | "Y" | "T")}
            required
          />
          <Button variant="outline" type="submit">
            Create
          </Button>
        </Stack>
      </Container>
    </form>
  );
}
