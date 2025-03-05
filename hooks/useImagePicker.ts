import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export function useImagePicker() {
  const [image, setImage] = useState<string | undefined>(undefined);

  async function openImagePicker() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission is required to access images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Image picking was canceled or failed.");
    }
  }

  function reset() {
    setImage(undefined);
  }

  return { image, openImagePicker, reset };
}
