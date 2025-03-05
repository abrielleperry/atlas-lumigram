import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

interface Post {
  id: string;
  image: string;
}

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/100";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const loggedInUserId = auth.currentUser?.uid;
  const isCurrentUser = loggedInUserId === userId;

  const [profile, setProfile] = useState({
    username: "User",
    profilePicture: DEFAULT_PROFILE_PICTURE,
  });

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        console.log("Fetching profile for user ID:", userId);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile({
            username: userSnap.data().username || "User",
            profilePicture:
              userSnap.data().profilePicture || DEFAULT_PROFILE_PICTURE,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("createdBy", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userPosts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        image: doc.data().image || "",
      }));

      setPosts(userPosts);
    });

    fetchUserProfile();
    return () => unsubscribe();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profile.profilePicture }}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{profile.username}</Text>

      <FlatList
        data={posts}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.image ? (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          ) : (
            <View style={styles.postImagePlaceholder} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    marginBottom: 90,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 30,
  },
  username: {
    fontSize: 20,
    marginBottom: 30,
  },

  postImage: {
    width: imageSize,
    height: imageSize,
  },
  postImagePlaceholder: {
    width: imageSize,
    height: imageSize,
    backgroundColor: "#ddd",
  },
});
