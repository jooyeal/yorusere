import { Button, Card, Flex, Grid, Group, Stack, Text } from "@mantine/core";
import { Expenses } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { convertExpenseType, convertPersonType } from "~/utils/common";
import BaseModal from "./BaseModal";
import { useDisclosure } from "@mantine/hooks";

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
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure();

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
          onClick={deleteOpen}
          disabled={
            rowModel.author === "Y"
              ? "jyol1234@gmail.com" !== session.data?.user.email
              : "seresere707070@gmail.com" !== session.data?.user.email
          }
        >
          Delete
        </Button>
      </Flex>
      <BaseModal opened={deleteOpened} onClose={deleteClose} centered>
        <Stack>
          <Text>Do you really want to delete?</Text>
          <Group position="right">
            <Button
              variant="outline"
              color="red"
              onClick={() => onClickDelete(rowModel.id)}
            >
              OK
            </Button>
            <Button variant="outline" onClick={deleteClose}>
              CANCEL
            </Button>
          </Group>
        </Stack>
      </BaseModal>
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
