import { Badge, Card, Stack, Text } from "@mantine/core";
import { PersonType } from "@prisma/client";
import React from "react";
import { convertPersonType } from "~/utils/common";

type Props = {
  usingFor: PersonType | undefined;
  author: PersonType | undefined;
  totalExpense: number | undefined;
};

export default function MainPanel({ usingFor, author, totalExpense }: Props) {
  return (
    <Stack>
      {usingFor && author && totalExpense ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            This month, the total expenses for{" "}
            <Badge variant="filled">{convertPersonType(usingFor)}</Badge> by{" "}
            <Badge variant="filled" color="green">
              {convertPersonType(author)}
            </Badge>{" "}
            amounted to
            {Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(totalExpense)}
          </Text>
        </Card>
      ) : (
        <Text>No data</Text>
      )}
    </Stack>
  );
}
