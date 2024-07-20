const STORAGE_KEY = "temno_data";

function getStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as TStorageType;
}

type TStorageType = {
  addresses?: string[];
};

type TSearchFavorite = { address?: string };

export function useFavorites() {
  function toggleFavorite({ address }: TSearchFavorite) {
    let storage = getStorage();
    if (address) {
      if (storage.addresses?.includes(address)) {
        storage = {
          ...storage,
          addresses: storage.addresses.filter((item) => item !== address),
        };
      } else {
        const addresses = storage.addresses || [];
        addresses?.push(address);
        storage = {
          ...storage,
          addresses,
        };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    }
  }

  function checkIsFavorite({ address }: TSearchFavorite) {
    const storage = getStorage();
    return storage.addresses?.find((item) => item === address);
  }

  return { toggleFavorite, checkIsFavorite, getStorage };
}
