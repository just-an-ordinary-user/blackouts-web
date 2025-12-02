import { Button, Flex, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

export type TQueueFormData = {
  queue: string;
};

type TQueueFormProps = {
  onSubmit(data: TQueueFormData): void;
};

export const QueueForm: FC<TQueueFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const form = useForm<TQueueFormData>({
    mode: "uncontrolled",
    initialValues: { queue: "" },
    validate: {
      queue: (value) =>
        Number.isNaN(value) || value === ""
          ? t("required_field_label", { field: t("queue_label") })
          : null,
    },
  });

  function handleClearForm() {
    form.reset();
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Flex gap={8} mt={-12}>
        <NumberInput
          mt="sm"
          style={{ width: "100%" }}
          placeholder={t("queue_label")}
          key={form.key("queue")}
          {...form.getInputProps("queue")}
        />
      </Flex>
      <Flex gap={8}>
        <Button type="submit" mt="sm">
          {t("submit_button")}
        </Button>

        <Button variant="subtle" mt="sm" onClick={handleClearForm}>
          {t("clear_button")}
        </Button>
      </Flex>
    </form>
  );
};
