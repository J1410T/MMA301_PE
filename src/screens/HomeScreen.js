import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
} from "../AsyncStorageHelper";
import Card from "../components/Card";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://67245231493fac3cf24de00d.mockapi.io/se172939"
        );
        const data = await response.json();
        console.log("Fetched products:", data); // Log the fetched data
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites();
      setFavorites(favs);
    };
    fetchFavorites();
  }, [isFocused]);

  const handleFavoriteToggle = async (product) => {
    if (favorites.some((fav) => fav.id === product.id)) {
      await removeFavorite(product.id);
      setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
    } else {
      await saveFavorite(product);
      setFavorites((prev) => [...prev, product]);
    }
  };

  const renderItem = ({ item }) => (
    <Card
      item={item}
      isFavorite={favorites.some((fav) => fav.id === item.id)}
      onPress={() => navigation.navigate("Detail", { product: item })}
      onSecondaryPress={() => handleFavoriteToggle(item)}
    />
  );

  // Sort products by id in descending order
  const sortedProducts = [...products].sort((a, b) => b.id - a.id);

  return (
    <FlatList
      data={sortedProducts}
      renderItem={renderItem}
      keyExtractor={(item) =>
        item.id ? item.id.toString() : Math.random().toString()
      }
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
});

export default HomeScreen;
