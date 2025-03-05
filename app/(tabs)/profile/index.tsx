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
import { useRouter } from "expo-router";
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
import { useLocalSearchParams } from "expo-router";

type UserPost = {
  id: string;
  image: string;
};

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

const defaultProfileImage = "https://via.placeholder.com/100";

export default function Page() {
  const router = useRouter();
  const userId = auth.currentUser?.uid;
  const params = useLocalSearchParams();

  const [profile, setProfile] = useState({
    username: "User",
    profileImage: defaultProfileImage,
  });

  const [posts, setPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        console.log("Fetching user profile for UID:", userId);

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        let username = auth.currentUser?.email
          ? auth.currentUser.email.split("@")[0]
          : "User";
        let profileImage = "";

        if (userSnap.exists()) {
          username = userSnap.data().username || username;
          profileImage = userSnap.data().profilePicture || "";
        }

        setProfile({ username, profileImage });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("createdBy", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userPosts: UserPost[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        image: doc.data().image || "",
      }));

      setPosts(userPosts);
    });

    fetchUserProfile();

    return () => unsubscribe();
  }, [userId, params.refresh]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/profile/edit",
            params: {
              username: profile.username,
              profileImage: profile.profileImage,
            },
          })
        }
      >
        {profile.profileImage ? (
          <Image
            source={{ uri: profile.profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
      </TouchableOpacity>

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
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
});
