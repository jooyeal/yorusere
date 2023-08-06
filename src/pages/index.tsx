import { Box, Container } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Header from "~/components/Header";
import { api } from "~/utils/api";

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
