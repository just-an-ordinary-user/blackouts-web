import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useUserStore } from "../stores/UserStore";
import { db } from "../firebase";
import { encrypt, decrypt } from "../helpers/crypto";

const COLLECTION_NAME = "addresses";

export function useCloudFavorites() {
  const { user } = useUserStore();

  async function addCloudFavorite(address: string) {
    if (user) {
      const docRef = doc(db, COLLECTION_NAME, user.uid);
      const docSnap = await getDoc(docRef);

      const encryptedAddress = await encrypt(address, user.uid);

      setDoc(docRef, {
        addresses: [...(docSnap.data()?.addresses || []), encryptedAddress],
      });
    }
  }

  async function removeCloudFavorite(address: string) {
    if (user) {
      const docRef = doc(db, COLLECTION_NAME, user.uid);
      const docSnap = await getDoc(docRef);

      const encryptedAddress = await encrypt(address, user.uid);

      setDoc(docRef, {
        addresses:
          docSnap
            .data()
            ?.addresses.filter((addr: string) => addr !== encryptedAddress) ||
          [],
      });
    }
  }

  async function getCloudFavorite(address: string) {
    if (user) {
      const docRef = doc(db, COLLECTION_NAME, user.uid);
      const docSnap = await getDoc(docRef);

      const encryptedAddress = await encrypt(address, user.uid);

      const foundAddress = docSnap
        .data()
        ?.addresses.find((addr: string) => addr === encryptedAddress);

      if (foundAddress) {
        return decrypt(foundAddress, user.uid);
      }
    }
  }

  async function toggleCloudFavorite(address: string) {
    if (await getCloudFavorite(address)) {
      await removeCloudFavorite(address);
    } else {
      await addCloudFavorite(address);
    }
  }

  async function getAllCloudFavorites() {
    if (user) {
      const docRef = doc(db, COLLECTION_NAME, user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const decryptedAddresses = [];
        for (const addr of docSnap.data().addresses) {
          const dec = await decrypt(addr, user.uid);
          decryptedAddresses.push(dec);
        }
        return decryptedAddresses;
      }

      const collRef = collection(db, COLLECTION_NAME);

      setDoc(doc(collRef, user.uid), {
        addresses: [],
      });

      return [];
    }
  }

  return { toggleCloudFavorite, getCloudFavorite, getAllCloudFavorites };
}
