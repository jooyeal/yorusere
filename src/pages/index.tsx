import {
  Box,
  Container,
  Stack,
  Title,
  Tabs,
  Select,
  Divider,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { PersonType } from "@prisma/client";
import { IconAnalyze, IconTable } from "@tabler/icons-react";
import Head from "next/head";
import { useState } from "react";
import AnalysisList from "~/components/AnalysisList";
import { api } from "~/utils/api";

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());
  const [person, setPerson] = useState<PersonType>("T");
  const [tab, setTab] = useState<string | null>("panel");
  const { data } = api.expense.getByMonth.useQuery({ date, person });

  return (
    <>
      <Head>
        <title>YORUSERE</title>
        <meta name="description" content="This website is for yoru and sere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Container>
          <Stack bg="white" sx={{ position: "sticky", top: 64, zIndex: 99 }}>
            <Title order={3}>Total Analysis</Title>
            <MonthPickerInput
              label="Month"
              value={date}
              onChange={(e) => setDate(new Date(e as Date))}
            />
            <Select
              label="Using for"
              defaultValue="T"
              value={person}
              data={[
                { label: "Together", value: "T" },
                { label: "Serena", value: "S" },
                { label: "Yoru", value: "Y" },
              ]}
              onChange={(e) => setPerson((e as PersonType) ?? "T")}
            />
            <Divider mt="sm" />
          </Stack>
          <Tabs defaultValue="panel" value={tab} onTabChange={setTab}>
            <Tabs.List
              bg="white"
              sx={{ position: "sticky", top: 277, zIndex: 99 }}
            >
              <Tabs.Tab value="panel" icon={<IconAnalyze size="0.8rem" />}>
                Panel
              </Tabs.Tab>
              <Tabs.Tab value="list" icon={<IconTable size="0.8rem" />}>
                List
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="panel" pt="xs">
              not yet
            </Tabs.Panel>

            <Tabs.Panel value="list" pt="xs">
              <AnalysisList data={data} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </Box>
    </>
  );
}
