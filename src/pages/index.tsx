import {
  Box,
  Container,
  Stack,
  Title,
  Tabs,
  Select,
  Divider,
  Button,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { PersonType } from "@prisma/client";
import { IconAnalyze, IconTable } from "@tabler/icons-react";
import Head from "next/head";
import { useState } from "react";
import AnalysisList from "~/components/AnalysisList";
import MainPanel from "~/components/MainPanel";
import { api } from "~/utils/api";

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

            <Tabs.Panel value="panel" pt="xs">
              <MainPanel
                usingFor={person}
                author={author}
                totalExpense={data?.totalExpense}
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
    </>
  );
}
