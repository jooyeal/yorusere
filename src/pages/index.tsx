import {
  Box,
  Container,
  Stack,
  Title,
  Tabs,
  Select,
  Divider,
  Button,
  TextInput,
  Textarea,
  ModalProps,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { DatePickerInput, MonthPickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PersonType } from "@prisma/client";
import { IconAnalyze, IconPlus, IconTable } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AnalysisList from "~/components/AnalysisList";
import BaseModal from "~/components/BaseModal";
import MainPanel from "~/components/MainPanel";
import { TcreateExpenseInput } from "~/server/api/scheme/expenseScheme";
import { api } from "~/utils/api";

function ExpenseAddModal({ opened, onClose }: ModalProps) {
  const { register, setValue, handleSubmit, reset } =
    useForm<TcreateExpenseInput>();
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
          reset();
          onClose();
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
    <BaseModal opened={opened} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <Container h={600}>
          <Stack>
            <Title order={3}>Create new expense</Title>
            <TextInput {...register("title")} label="Title" required />
            <TextInput
              {...register("amount")}
              type="number"
              label="Amount"
              required
            />
            <DatePickerInput
              {...register("dateTime")}
              label="Pick date and time"
              onChange={(e) => setValue("dateTime", e as Date)}
              required
            />
            <Textarea {...register("content")} label="Content" />
            <Select
              {...register("person")}
              label="Using for"
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
    </BaseModal>
  );
}

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());
  const [person, setPerson] = useState<PersonType>("T");
  const [author, setAuthor] = useState<PersonType>("Y");
  const [tab, setTab] = useState<string | null>("panel");
  const { data, refetch } = api.expense.getByMonth.useQuery({
    date,
    person,
    author,
  });
  const { mutate } = api.expense.delete.useMutation();
  const [opened, { open, close }] = useDisclosure();

  const onClickDelete = (id: string) => {
    mutate(
      { id },
      {
        onSuccess: () => {
          notifications.show({ message: "deleted!" });
          refetch();
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
  };
  return (
    <>
      <Head>
        <title>YORUSERE</title>
        <meta name="description" content="This website is for yoru and sere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Container>
          <Tabs defaultValue="panel" value={tab} onTabChange={setTab}>
            <Tabs.List
              bg="white"
              sx={{ position: "sticky", zIndex: 10, top: 64 }}
            >
              <Tabs.Tab value="panel" icon={<IconAnalyze size="0.8rem" />}>
                Panel
              </Tabs.Tab>
              <Tabs.Tab value="list" icon={<IconTable size="0.8rem" />}>
                List
              </Tabs.Tab>
            </Tabs.List>

            <Stack bg="white" p="md">
              <Title order={3}>Total Analysis</Title>
              <Flex justify="flex-end">
                <ActionIcon variant="outline" onClick={open}>
                  <IconPlus />
                </ActionIcon>
              </Flex>
              <MonthPickerInput
                label="Month"
                value={date}
                onChange={(e) => {
                  const date = new Date(e as Date);
                  date.setDate(date.getDate() + 1);
                  setDate(date);
                }}
              />
              <Select
                label="Using for"
                defaultValue="A"
                value={person}
                data={[
                  { label: "Total", value: "A" },
                  { label: "Together", value: "T" },
                  { label: "Serena", value: "S" },
                  { label: "Yoru", value: "Y" },
                ]}
                onChange={(e) => setPerson((e as PersonType) ?? "A")}
              />
              <Select
                label="Author"
                defaultValue="Y"
                value={author}
                data={[
                  { label: "Yoru", value: "Y" },
                  { label: "Serena", value: "S" },
                ]}
                onChange={(e) => setAuthor((e as PersonType) ?? "Y")}
              />
              <Button variant="outline" onClick={() => refetch()}>
                Search
              </Button>
              <Divider mt="sm" />
            </Stack>

            <Tabs.Panel value="panel" pt="xs" pb="xs">
              <MainPanel
                usingFor={person}
                author={author}
                totalExpense={data?.totalExpense}
                yoruTogetherExpense={data?.yoruTogetherExpense}
                yoruSereExpense={data?.yoruSereExpense}
                sereTogetherExpense={data?.sereTogetherExpense}
                sereYoruExpense={data?.sereYoruExpense}
                yoruTotalExpense={data?.yoruTotalExpense}
                sereTotalExpense={data?.sereTotalExpense}
                yoruAmountHaveToPay={data?.yoruAmountHaveToPay}
              />
            </Tabs.Panel>

            <Tabs.Panel value="list" pt="xs">
              <AnalysisList
                data={data?.expensesData}
                onClickDelete={onClickDelete}
              />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </Box>
      <ExpenseAddModal
        opened={opened}
        onClose={() => {
          refetch();
          close();
        }}
      />
    </>
  );
}
