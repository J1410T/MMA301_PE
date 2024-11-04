import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Card = ({ item, onPress, isFavorite, onSecondaryPress }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteToggle = async () => {
    onSecondaryPress();
    setFavorite(!favorite);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.info}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.name}>{item.productName}</Text>
        </TouchableOpacity>

        <Text style={styles.price}>Price: {formatPrice(item.price)}</Text>
        <Text style={styles.team}>
          Limit Time Deal: {(item.limitTimeDeal * 100).toFixed(0)}%
        </Text>
        <Text style={styles.team}>
          Gift: {item.isGift ? "Gift" : "Not Gifted"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
        >
          <MaterialIcons
            name={favorite ? "favorite" : "favorite-outline"}
            size={24}
            color={favorite ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  imageContainer: {
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  isCaptain: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#42A5F5",
    alignItems: "center",
  },
  favoriteButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Card;
