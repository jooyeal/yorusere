import { Badge, Card, Stack, Text } from "@mantine/core";
import { PersonType } from "@prisma/client";
import React from "react";
import { convertPersonType } from "~/utils/common";

type Props = {
  usingFor: PersonType | undefined;
  author: PersonType | undefined;
  totalExpense: number | undefined;
  yoruTogetherExpense: number | undefined;
  yoruSereExpense: number | undefined;
  sereTogetherExpense: number | undefined;
  sereYoruExpense: number | undefined;
  yoruTotalExpense: number | undefined;
  sereTotalExpense: number | undefined;
  yoruAmountHaveToPay: number | undefined;
};

export default function MainPanel({
  usingFor,
  author,
  totalExpense,
  yoruTogetherExpense,
  yoruSereExpense,
  sereTogetherExpense,
  sereYoruExpense,
  yoruTotalExpense,
  sereTotalExpense,
  yoruAmountHaveToPay,
}: Props) {
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
      ) : null}
      {yoruAmountHaveToPay ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            Yoru have to pay{" "}
            <Badge variant="filled" color="orange">
              {Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
              }).format(yoruAmountHaveToPay)}
            </Badge>{" "}
            by this month
          </Text>
        </Card>
      ) : null}
      {yoruTogetherExpense ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            Yoru spent{" "}
            <Badge variant="filled">
              {Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
              }).format(yoruTogetherExpense)}
            </Badge>{" "}
            for together this month
          </Text>
        </Card>
      ) : null}
      {yoruSereExpense ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            Yoru spent{" "}
            <Badge variant="filled">
              {Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
              }).format(yoruSereExpense)}
            </Badge>{" "}
            for serena this month
          </Text>
        </Card>
      ) : null}
      {sereTogetherExpense ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            Sere spent{" "}
            <Badge variant="filled" color="pink">
              {Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
              }).format(sereTogetherExpense)}
            </Badge>{" "}
            for together this month
          </Text>
        </Card>
      ) : null}
      {sereYoruExpense ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text>
            Sere spent{" "}
            <Badge variant="filled" color="pink">
              {Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
              }).format(sereYoruExpense)}
            </Badge>{" "}
            for yoru this month
          </Text>
        </Card>
      ) : null}
    </Stack>
  );
}
