import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface ImagePreviewProps {
  src?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src }) => {
  return (
    <View style={styles.container}>
      {src ? (
        <Image source={{ uri: src }} style={styles.image} />
      ) : (
        <Image
          source={require("../images/placeholder-image.png")}
          style={styles.placeholderImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    margin: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
});

export default ImagePreview;
