import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
} from "../AsyncStorageHelper";
import Card from "../components/Card";

const AutomaticScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]); // State to hold products data
  const [imported, setImported] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  // Fetch products from the mock API
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

  // Filter and sort products when products data changes
  useEffect(() => {
    if (products.length > 0) {
      const sortedImported = products
        .filter(
          (product) => product.nation != "Vietnam" && product.packaging != "Box"
        )

        .sort((a, b) => a.price - b.price);

      setImported(sortedImported);
    }
  }, [products]); // Run when products data changes

  const fetchFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
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
      <FlatList
        data={imported}
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
});

export default AutomaticScreen;
