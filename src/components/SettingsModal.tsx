import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  ActionIcon,
  Box,
  NavLink,
  useMantineColorScheme,
  Divider,
} from "@mantine/core";
import {
  IconChevronRight,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { useUserStore } from "../stores/UserStore";
import { IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { notifications } from "@mantine/notifications";
import { auth, provider } from "../firebase";

// TODO: move it somewhere else
const LANGUAGES: Record<string, { icon: string; label: string }> = {
  en: {
    icon: "https://flagsapi.com/US/flat/32.png",
    label: "English",
  },
  uk: {
    icon: "https://flagsapi.com/UA/flat/32.png",
    label: "Українська",
  },
};

export const SettingsModal = () => {
  const { user, setUser } = useUserStore();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { i18n, t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const googlePopUp = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      notifications.show({
        title: t("login_success_title"),
        message: `${t("logged_in_as_label")} ${user.user.displayName}`,
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        notifications.show({
          title: t("login_failed_title"),
          message: error.message,
        });
      } else {
        console.error(error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error(error);
      // TODO: Notify about logout failure
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
  }, [setUser]);

  return (
    <>
      <ActionIcon
        variant="default"
        size="xl"
        aria-label="Toggle settings modal"
        onClick={open}
      >
        <IconSettings />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={t("settings_title")}
        centered
      >
        <Box>
          <NavLink
            leftSection={
              user?.photoURL ? (
                <img
                  src={user.photoURL}
                  style={{ width: 36, height: 36, borderRadius: "50%" }}
                  alt="user avatar"
                />
              ) : (
                <IconUserCircle />
              )
            }
            label={user ? user.displayName : t("login_item")}
            description={user?.email}
            rightSection={user && <IconChevronRight />}
            onClick={() => !user && googlePopUp()}
          >
            {user && (
              <NavLink
                leftSection={<IconLogout />}
                label={t("logout_item")}
                onClick={logout}
              />
            )}
          </NavLink>
          <Divider />
          <NavLink
            label={t("lang_item")}
            description={LANGUAGES[i18n.language].label}
            rightSection={<IconChevronRight />}
          >
            {Object.keys(LANGUAGES).map((lang) => (
              <NavLink
                key={lang}
                leftSection={<img src={LANGUAGES[lang].icon} alt={lang} />}
                label={LANGUAGES[lang].label}
                onClick={() => i18n.changeLanguage(lang)}
              />
            ))}
          </NavLink>
          <NavLink
            label={t("color_scheme_item")}
            description={
              colorScheme === "auto"
                ? t("color_scheme_system_item")
                : colorScheme === "dark"
                  ? t("color_scheme_dark_item")
                  : t("color_scheme_light_item")
            }
            rightSection={<IconChevronRight />}
          >
            <NavLink
              leftSection={<IconSunMoon />}
              label={t("color_scheme_system_item")}
              onClick={() => setColorScheme("auto")}
            />
            <NavLink
              leftSection={<IconMoon />}
              label={t("color_scheme_dark_item")}
              onClick={() => setColorScheme("dark")}
            />
            <NavLink
              leftSection={<IconSun />}
              label={t("color_scheme_light_item")}
              onClick={() => setColorScheme("light")}
            />
          </NavLink>
        </Box>
      </Modal>
    </>
  );
};
