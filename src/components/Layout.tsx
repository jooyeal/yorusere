import { Box, Center, LoadingOverlay, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const session = useSession();
  if (session.status === "loading")
    return <LoadingOverlay visible={true} overlayBlur={2} />;
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
