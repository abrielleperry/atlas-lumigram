import React, { useState, useCallback } from "react";
import { View, Image, StyleSheet, Text, Alert } from "react-native";
import { favoritesFeed } from "../../placeholder";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
} from "react-native-gesture-handler";

interface FeedItem {
  id: string;
  image: string;
  caption: string;
}

const ImageItem = ({ item }: { item: FeedItem }) => {
  const [showCaption, setShowCaption] = useState(false);

  const handleLongPress = useCallback(() => {
    setShowCaption(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setShowCaption(false);
  }, []);

  const handleDoubleTap = useCallback(() => {
    Alert.alert("Image Favorited");
  }, []);
  return (
    <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
      <LongPressGestureHandler
        onActivated={handleLongPress}
        onEnded={handlePressOut}
        minDurationMs={500}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {showCaption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </LongPressGestureHandler>
    </TapGestureHandler>
  );
};
export default function Page() {
  const renderItem = ({ item }: { item: FeedItem }) => {
    return <ImageItem item={item} />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={favoritesFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={300}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 5,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  captionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  captionText: {
    color: "white",
    textAlign: "center",
  },
});
