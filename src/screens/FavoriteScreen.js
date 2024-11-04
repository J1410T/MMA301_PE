import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  removeAllFavorites,
} from "../AsyncStorageHelper";
import Card from "../components/Card";

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites();
      setFavorites(favs);
    };
    fetchFavorites();
  }, [isFocused]);

  const handleFavoriteToggle = async (product) => {
    if (favorites.some((fav) => fav.id === product.id)) {
      Alert.alert(
        "Remove from Favorites",
        "Are you sure you want to remove this product from your favorites?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await removeFavorite(product.id);
              setFavorites((prev) =>
                prev.filter((fav) => fav.id !== product.id)
              );
            },
          },
        ]
      );
    } else {
      await saveFavorite(product);
      setFavorites((prev) => [...prev, product]);
    }
  };

  const handleRemoveAllFavorites = () => {
    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all products from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await removeAllFavorites();
            setFavorites([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card
      item={item}
      isFavorite={favorites.some((fav) => fav.id === item.id)}
      onPress={() => navigation.navigate("Detail", { product: item })}
      onSecondaryPress={() => handleFavoriteToggle(item)}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.removeAllButton}
        onPress={handleRemoveAllFavorites}
      >
        <Text style={styles.removeAllButtonText}>Remove All Favorites</Text>
      </TouchableOpacity>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    padding: 10,
  },
  removeAllButton: {
    backgroundColor: "#E91E63",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  removeAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FavoriteScreen;
