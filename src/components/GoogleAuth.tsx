import { ActionIcon, Menu } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/UserStore";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

export const GoogleAuth = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState("");
  const { user, setUser } = useUserStore();

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
      if (user) {
        const photoURL = user.photoURL;
        photoURL && setAvatar(photoURL);
        setUser(user);
      } else {
        setUser(null);
        setAvatar("");
      }
    });
  }, [setUser]);

  return (
    <>
      {!user && (
        <ActionIcon
          variant="default"
          size="xl"
          aria-label="User login"
          ml={8}
          onClick={googlePopUp}
          p={0}
        >
          <IconLock />
        </ActionIcon>
      )}

      {user && (
        <Menu shadow="md" width={220}>
          <Menu.Target>
            <ActionIcon variant="default" size="xl" aria-label="user" ml={8}>
              <img
                src={avatar}
                alt="avatar"
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
              />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={logout}>{t("logout_item")}</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
};
