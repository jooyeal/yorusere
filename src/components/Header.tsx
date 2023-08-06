import { ActionIcon, Flex, Stack, Text } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import React from "react";
import BaseModal from "./BaseModal";
import { useDisclosure } from "@mantine/hooks";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Header() {
  const [opened, { open, close }] = useDisclosure(false);
  const session = useSession();
  const router = useRouter();

  const onClickLink = (href: string) => {
    close();
    router.push(href);
  };
  return (
    <Flex className="h-16 p-4" align="center">
      <ActionIcon variant="outline" onClick={open}>
        <IconMenu2 />
      </ActionIcon>
      <BaseModal opened={opened} onClose={close} fullScreen>
        <Stack justify="space-between" h="calc(100vh - 80px)">
          <Stack>
            <Text className="font-semibold" onClick={() => onClickLink("/")}>
              Home
            </Text>
            <Text
              className="font-semibold"
              onClick={() => onClickLink("/expense/add")}
            >
              Enter new expense
            </Text>
          </Stack>
          {session.data?.user ? (
            <Text className="font-bold" onClick={() => signOut()}>
              Sign out
            </Text>
          ) : (
            <Text className="font-bold" onClick={() => signIn()}>
              Sign in
            </Text>
          )}
        </Stack>
      </BaseModal>
    </Flex>
  );
}
