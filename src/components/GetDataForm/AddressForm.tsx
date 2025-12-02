import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

export type TAddressFormData = {
  city: string;
  address: string;
  nob: string;
};

type TAddressFormProps = {
  onSubmit(data: TAddressFormData): void;
};

export const AddressForm: FC<TAddressFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const form = useForm<TAddressFormData>({
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

  function handleClearForm() {
    form.reset();
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
