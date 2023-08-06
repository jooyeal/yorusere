import { Modal, ModalProps } from "@mantine/core";
import React, { PropsWithChildren } from "react";

export default function BaseModal({
  opened,
  onClose,
  children,
  ...rest
}: PropsWithChildren<ModalProps>) {
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton {...rest}>
      {children}
    </Modal>
  );
}
