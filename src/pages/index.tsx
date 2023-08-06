import { Box, Container } from "@mantine/core";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>YORUSERE</title>
        <meta name="description" content="This website is for yoru and sere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Container></Container>
      </Box>
    </>
  );
}
