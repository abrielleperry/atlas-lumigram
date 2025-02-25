import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import Loading from "@/components/Loading";
import ImagePreview from "@/components/ImagePreview";
import { useImagePicker } from "@/hooks/useImagePicker";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function Page() {
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { image, openImagePicker, reset } = useImagePicker();

  return (
    <View style={styles.container}>
      <ImagePreview src={image} />

      <View style={styles.footerContainer}>
        {!image ? (
          <Pressable style={styles.uploadButton} onPress={openImagePicker}>
            <IconSymbol size={28} name="photo" color="white" />
            <Text style={styles.uploadText}>Choose a photo</Text>
          </Pressable>
        ) : (
          <View style={styles.captionContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a caption"
              placeholderTextColor="#888"
              value={caption}
              onChangeText={setCaption}
            />
            <Pressable style={styles.saveButton} onPress={() => alert("Saved")}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                reset();
                setCaption("");
              }}
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>
        )}
      </View>

      {loading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  footerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  captionContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 55,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: "#3FBFA8",
    borderWidth: 1,
    color: "#333",
    fontSize: 16,
  },
  saveButton: {
    width: "90%",
    height: 60,
    backgroundColor: "#3FBFA8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  resetButton: {
    width: "90%",
    height: 60,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  resetText: {
    color: "black",
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    width: "90%",
    height: 60,
    backgroundColor: "#3FBFA8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    gap: 10,
  },
  uploadText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
