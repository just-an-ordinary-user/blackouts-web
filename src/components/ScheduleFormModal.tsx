import type { FC } from "react";
import { Modal, Button, TextInput, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { city: "", address: "", nob: "" },
    validate: {
      city: (value) =>
        !value.length
          ? t("required_field_label", { field: t("city_label") })
          : null,
      address: (value) =>
        !value.length
          ? t("required_field_label", { field: t("address_label") })
          : null,
      nob: (value) =>
        !value.length
          ? t("required_field_label", { field: t("nob_label") })
          : null,
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
      title={t("get_graphs_title")}
      transitionProps={{ transition: "slide-up" }}
    >
      <form onSubmit={form.onSubmit(goToSchedule)}>
        <TextInput
          placeholder={t("city_label")}
          key={form.key("city")}
          {...form.getInputProps("city")}
        />
        <Flex gap={8}>
          <TextInput
            mt="sm"
            style={{ width: "100%" }}
            placeholder={t("address_label")}
            key={form.key("address")}
            {...form.getInputProps("address")}
          />
          <TextInput
            mt="sm"
            style={{ width: 120 }}
            placeholder={t("nob_label")}
            key={form.key("nob")}
            {...form.getInputProps("nob")}
          />
        </Flex>
        <Button type="submit" mt="sm">
          {t("submit_button")}
        </Button>
      </form>
    </Modal>
  );
};
