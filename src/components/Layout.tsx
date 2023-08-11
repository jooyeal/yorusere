import { Box, Center, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const session = useSession();
  if (session.status === "loading") return <LoadingScreen visible={true} />;
  if (session.status === "unauthenticated")
    return (
      <Box>
        <Header />
        <Center>
          <Title>Please sign in</Title>
        </Center>
      </Box>
    );
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
}
