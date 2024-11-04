import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const saveFavorite = async (watch) => {
  try {
    const favorites = await getFavorites();
    const newFavorites = [...favorites, watch];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error(error);
  }
};

export const removeFavorite = async (watchId) => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter((watch) => watch.id !== watchId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error(error);
  }
};

export const removeAllFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error(error);
  }
};
