import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { WishList } from "@prisma/client";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import BaseModal from "~/components/BaseModal";
import { TcreateWishListInput } from "~/server/api/scheme/wishListScheme";
import { api } from "~/utils/api";

const Item = ({
  rowModel,
  onClickCheckBox,
  onClickTrash,
  createLoading,
  updateLoading,
  deleteLoading,
}: {
  rowModel: WishList;
  onClickCheckBox: (id: string, isChecked: boolean) => void;
  onClickTrash: (id: string) => void;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}) => {
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure();

  return (
    <Grid>
      <Grid.Col span={1}>
        <Checkbox
          defaultChecked={rowModel.isChecked}
          onChange={() => onClickCheckBox(rowModel.id, rowModel.isChecked)}
          disabled={updateLoading || deleteLoading || createLoading}
        />
      </Grid.Col>
      <Grid.Col span={10}>
        <Text className={`${rowModel.isChecked ? "line-through" : ""}`}>
          {rowModel.title}
        </Text>
      </Grid.Col>
      <Grid.Col span={1}>
        <ActionIcon
          variant="outline"
          color="red"
          size="sm"
          onClick={deleteOpen}
          disabled={updateLoading || deleteLoading || createLoading}
        >
          <IconTrash />
        </ActionIcon>
      </Grid.Col>
      <BaseModal opened={deleteOpened} onClose={deleteClose} centered>
        <Stack>
          <Text>Do you really want to delete?</Text>
          <Group position="right">
            <Button
              variant="outline"
              color="red"
              onClick={() => onClickTrash(rowModel.id)}
            >
              OK
            </Button>
            <Button variant="outline" onClick={deleteClose}>
              CANCEL
            </Button>
          </Group>
        </Stack>
      </BaseModal>
    </Grid>
  );
};

export default function ShoppingMain() {
  const [opened, { open, close }] = useDisclosure();
  const { data, refetch, isLoading } = api.wishlist.getWishList.useQuery();
  const { mutate: createWishlist, isLoading: createLoading } =
    api.wishlist.create.useMutation();
  const { mutate: updateWishlist, isLoading: updateLoading } =
    api.wishlist.update.useMutation();
  const { mutate: deleteWishlist, isLoading: deleteLoading } =
    api.wishlist.delete.useMutation();
  const { register, handleSubmit, reset } = useForm<TcreateWishListInput>();

  const onClickOk = handleSubmit((data) => {
    createWishlist(
      { ...data },
      {
        onSuccess: () => {
          notifications.show({ message: "Added!" });
          refetch();
          reset({ title: "" });
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
    updateWishlist(
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
    deleteWishlist(
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
        <Title>Wishlist</Title>
        <Flex justify="flex-end">
          <ActionIcon variant="outline" onClick={open}>
            <IconPlus />
          </ActionIcon>
        </Flex>
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
      </Stack>
      <BaseModal opened={opened} onClose={close}>
        <form onSubmit={onClickOk}>
          <Stack>
            <TextInput
              {...register("title")}
              label="Title"
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
