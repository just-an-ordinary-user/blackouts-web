import type { FC } from "react";
import { Modal, Button, TextInput, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

type TFormData = {
  city: string;
  address: string;
  nob: string;
};

type TScheduleFormModalProps = {
  opened: boolean;
  open(): void;
  close(): void;
};

export const ScheduleFormModal: FC<TScheduleFormModalProps> = ({
  opened,
  close,
}) => {
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { city: "", address: "", nob: "" },
    validate: {
      city: (value) => (!value.length ? "Field City is required" : null),
      address: (value) => (!value.length ? "Field Address is required" : null),
      nob: (value) => (!value.length ? "Field Number is required" : null),
    },
  });

  function goToSchedule(data: TFormData) {
    close();
    navigate(`/schedule?address=${Object.values(data).join(",")}`);
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Get graphs by address"
      transitionProps={{ transition: "slide-up" }}
    >
      <form onSubmit={form.onSubmit(goToSchedule)}>
        <TextInput
          placeholder="City"
          key={form.key("city")}
          {...form.getInputProps("city")}
        />
        <Flex gap={8}>
          <TextInput
            mt="sm"
            style={{ width: "100%" }}
            placeholder="Address"
            key={form.key("address")}
            {...form.getInputProps("address")}
          />
          <TextInput
            mt="sm"
            style={{ width: 120 }}
            placeholder="No"
            key={form.key("nob")}
            {...form.getInputProps("nob")}
          />
        </Flex>
        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
