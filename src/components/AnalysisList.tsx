import { Button, Card, Flex, Grid, Stack } from "@mantine/core";
import { Expenses } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { convertExpenseType, convertPersonType } from "~/utils/common";

type Props = {
  data: Expenses[] | undefined;
  onClickDelete: (id: string) => void;
};

const Row = ({
  rowModel,
  onClickDelete,
}: {
  rowModel: Expenses;
  onClickDelete: (id: string) => void;
}) => {
  const session = useSession();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Grid>
        <Grid.Col span={4}>Date</Grid.Col>
        <Grid.Col span={8}>
          {Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(rowModel.dateTime)}
        </Grid.Col>
        <Grid.Col span={4}>Amount</Grid.Col>
        <Grid.Col span={8}>
          {Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
          }).format(rowModel.amount)}
        </Grid.Col>
        <Grid.Col span={4}>Title</Grid.Col>
        <Grid.Col span={8}>{rowModel.title}</Grid.Col>
        <Grid.Col span={4}>Type</Grid.Col>
        <Grid.Col span={8}>{convertExpenseType(rowModel.type)}</Grid.Col>
        <Grid.Col span={4}>Using for</Grid.Col>
        <Grid.Col span={8}>{convertPersonType(rowModel.person)}</Grid.Col>
        <Grid.Col span={4}>Author</Grid.Col>
        <Grid.Col span={8}>{convertPersonType(rowModel.author)}</Grid.Col>
      </Grid>
      <Flex justify="flex-end">
        <Button
          variant="outline"
          color="red"
          onClick={() => onClickDelete(rowModel.id)}
          disabled={
            rowModel.author === "Y"
              ? "jyol1234@gmail.com" !== session.data?.user.email
              : "seresere707070@gmail.com" !== session.data?.user.email
          }
        >
          Delete
        </Button>
      </Flex>
    </Card>
  );
};

export default function AnalysisList({ data, onClickDelete }: Props) {
  return (
    <Stack p="sm">
      {data?.map((row) => (
        <Row key={row.id} rowModel={row} onClickDelete={onClickDelete} />
      ))}
    </Stack>
  );
}
