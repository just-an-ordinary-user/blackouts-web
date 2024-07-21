import { Menu, ActionIcon } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

// TODO: move it somewhere else
const LANGUAGES: Record<string, string> = {
  "en-US": "English",
  "ua-UA": "Українська",
};

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="xl"
          aria-label="Select language"
          mr={8}
        >
          <IconLanguage stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {Object.keys(LANGUAGES).map((lang) => (
          <Menu.Item key={lang} onClick={() => i18n.changeLanguage(lang)}>
            {LANGUAGES[lang]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
