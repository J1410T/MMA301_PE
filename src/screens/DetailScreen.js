import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from "../AsyncStorageHelper";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkFavorite = async () => {
      const favorites = await getFavorites();
      setIsFavorite(favorites.some((fav) => fav.id === product.id));
    };
    checkFavorite();
  }, []);

  const handleFavoriteToggle = async () => {
    if (isFavorite) {
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
              setIsFavorite(false);
            },
          },
        ]
      );
    } else {
      await saveFavorite(product);
      setIsFavorite(true);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-outline"}
            size={24}
            color={isFavorite ? "red" : "black"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.productName}</Text>

      <Text style={styles.price}>{formatPrice(product.price)} vnd</Text>
      <Text style={styles.brand}>
        Limit Time Deal: {(product.limitTimeDeal * 100).toFixed(0)}%
      </Text>
      <Text style={styles.brand}>Cover: {product.cover}</Text>
      <Text style={styles.brand}>Nation: {product.nation}</Text>
      <Text style={styles.brand}>Category: {product.category}</Text>
      <Text style={styles.brand}>Packaging:{product.packaging}</Text>
      <Text style={styles.brand}>
        Gift: {product.isGift ? "Gift" : "Not Gifted"}{" "}
        <MaterialIcons
          style={styles.brand}
          name={product.isGift ? "card-giftcard" : "card-giftcard"}
          size={24}
        />
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  brand: {
    fontSize: 18,
    color: "#888",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E91E63",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  favoriteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default DetailScreen;
