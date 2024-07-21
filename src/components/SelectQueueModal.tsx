import type { FC } from "react";
import { Modal, Flex, Badge, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type TSelectQueueModalProps = {
  opened: boolean;
  open(): void;
  close(): void;
  queues: string[];
  address: string;
};

export const SelectQueueModal: FC<TSelectQueueModalProps> = ({
  opened,
  close,
  address,
  queues,
}) => {
  const navigate = useNavigate();

  function goToSchedule(queue: string) {
    close();
    navigate(`/schedule?address=${address}&queue=${queue}`);
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      transitionProps={{ transition: "slide-up" }}
    >
      <Text size="xl">There is multiple queues for address</Text>
      <Text size="xl">"{address}"</Text>
      <Flex gap={8} mt="lg">
        {queues.map((queue) => (
          <Badge
            key={queue}
            size="lg"
            style={{ padding: 16, fontSize: 20 }}
            onClick={() => goToSchedule(queue)}
          >
            {queue}
          </Badge>
        ))}
      </Flex>
    </Modal>
  );
};
