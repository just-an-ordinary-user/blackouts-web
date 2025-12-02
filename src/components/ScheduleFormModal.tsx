import { Modal, Tabs } from "@mantine/core";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddressForm, type TAddressFormData } from "./GetDataForm/AddressForm";
import { QueueForm, type TQueueFormData } from "./GetDataForm/QueueForm";

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
  const [activeTab, setActiveTab] = useState<"address" | "queue">("address");

  function handleSubmit(data: TAddressFormData & TQueueFormData) {
    close();
    if ("queue" in data) {
      navigate(`/schedule?queue=${data.queue}`);
    } else {
      navigate(`/schedule?address=${Object.values(data).join(",")}`);
    }
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t("get_graphs_title")}
      transitionProps={{ transition: "slide-up" }}
    >
      <Tabs
        value={activeTab}
        onChange={setActiveTab as (value: string | null) => void}
        mb={16}
      >
        <Tabs.List grow>
          <Tabs.Tab value="address">{t("address_label")}</Tabs.Tab>
          <Tabs.Tab value="queue">{t("queue_label")}</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {activeTab === "address" && <AddressForm onSubmit={handleSubmit} />}
      {activeTab === "queue" && <QueueForm onSubmit={handleSubmit} />}
    </Modal>
  );
};
