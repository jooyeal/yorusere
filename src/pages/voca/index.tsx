import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Voca } from "@prisma/client";
import {
  IconEye,
  IconEyeOff,
  IconPlus,
  IconTrash,
  IconVolume,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BaseModal from "~/components/BaseModal";
import { TcreateVocaInput } from "~/server/api/scheme/vacaScheme";
import { api } from "~/utils/api";

const Item = ({
  rowModel,
  onClickCheckBox,
  onClickTrash,
  createLoading,
  updateLoading,
  deleteLoading,
}: {
  rowModel: Voca;
  onClickCheckBox: (id: string, isChecked: boolean) => void;
  onClickTrash: (id: string) => void;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const onClickSpeaker = (text: string) => {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = "en-GB";
    msg.text = text;
    window.speechSynthesis.speak(msg);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section p="xs">
        <Group position="right">
          <ActionIcon
            variant="outline"
            onClick={() => onClickSpeaker(rowModel.voca)}
          >
            <IconVolume />
          </ActionIcon>
          <ActionIcon variant="outline" onClick={opened ? close : open}>
            {opened ? <IconEyeOff /> : <IconEye />}
          </ActionIcon>
        </Group>
      </Card.Section>
      <Stack>
        <Text className="font-bold">{rowModel.voca}</Text>
        {opened && <Text>{rowModel.mean}</Text>}
      </Stack>
      <Card.Section p="xs">
        <Group position="apart">
          <Checkbox
            label="learnt"
            defaultChecked={rowModel.isChecked}
            onChange={() => onClickCheckBox(rowModel.id, rowModel.isChecked)}
            disabled={updateLoading || deleteLoading || createLoading}
          />
          <ActionIcon
            variant="outline"
            color="red"
            size="sm"
            onClick={() => onClickTrash(rowModel.id)}
            disabled={updateLoading || deleteLoading || createLoading}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default function Voca() {
  const [tab, setTab] = useState<string | null>("not");
  const [opened, { open, close }] = useDisclosure();
  const { register, handleSubmit, reset } = useForm<TcreateVocaInput>();
  const { data, refetch, isLoading } = api.voca.getVocas.useQuery({
    value: tab as "not" | "all" | "ok",
  });
  const { mutate: createVoca, isLoading: createLoading } =
    api.voca.create.useMutation();
  const { mutate: updateVoca, isLoading: updateLoading } =
    api.voca.update.useMutation();
  const { mutate: deleteVoca, isLoading: deleteLoading } =
    api.voca.delete.useMutation();

  const onClickOk = handleSubmit((data) => {
    createVoca(
      { ...data },
      {
        onSuccess: () => {
          notifications.show({ message: "Added!" });
          refetch();
          reset({ voca: "", mean: "" });
          close();
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

  const onClickCheckBox = (id: string, isChecked: boolean) => {
    updateVoca(
      { id, isChecked },
      {
        onSuccess: () => {
          notifications.show({ message: "Updated!" });
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

  const onClickTrash = (id: string) => {
    deleteVoca(
      { id },
      {
        onSuccess: () => {
          notifications.show({ message: "Deleted!" });
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
    <Container>
      <Stack>
        <Title>Vocabulary</Title>
        <Flex justify="flex-end">
          <ActionIcon variant="outline" onClick={open}>
            <IconPlus />
          </ActionIcon>
        </Flex>
      </Stack>
      <Tabs defaultValue="not" value={tab} onTabChange={setTab}>
        <Tabs.List bg="white" sx={{ position: "sticky", zIndex: 10, top: 64 }}>
          <Tabs.Tab value="not">Not studied</Tabs.Tab>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="ok">Studied</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Stack mt="sm">
        {data?.map((row) => (
          <Item
            key={row.id}
            rowModel={row}
            onClickCheckBox={onClickCheckBox}
            onClickTrash={onClickTrash}
            createLoading={createLoading}
            updateLoading={updateLoading}
            deleteLoading={deleteLoading}
          />
        ))}
      </Stack>

      <BaseModal opened={opened} onClose={close}>
        <form onSubmit={onClickOk}>
          <Stack>
            <TextInput
              {...register("voca")}
              label="Vocabulary"
              required
              disabled={createLoading}
            />
            <TextInput
              {...register("mean")}
              label="mean"
              required
              disabled={createLoading}
            />
            <Group position="right">
              <Button variant="outline" type="submit" disabled={createLoading}>
                OK
              </Button>
              <Button
                variant="outline"
                color="red"
                onClick={close}
                disabled={createLoading}
              >
                CANCEL
              </Button>
            </Group>
          </Stack>
        </form>
      </BaseModal>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
    </Container>
  );
}
