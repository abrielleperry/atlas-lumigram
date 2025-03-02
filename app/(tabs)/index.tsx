import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import Loading from "@/components/Loading";
import { doc, setDoc } from "firebase/firestore";

interface FeedItem {
  id: string;
  image: string;
  caption: string;
}

const PAGE_SIZE = 10;

const ImageItem = ({ item }: { item: FeedItem }) => {
  const [showCaption, setShowCaption] = useState(false);
  const { user } = useAuth();

  const handleLongPress = useCallback(() => {
    setShowCaption(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setShowCaption(false);
  }, []);

  const handleDoubleTap = useCallback(async () => {
    if (!user) {
      Alert.alert("You need to be logged in to favorite images.");
      return;
    }

    try {
      const favoriteRef = doc(db, "favorites", `${user.uid}_${item.id}`);
      await setDoc(favoriteRef, {
        userId: user.uid,
        imageId: item.id,
        image: item.image,
        caption: item.caption,
        favoritedAt: new Date(),
      });

      Alert.alert("Image added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Failed to add to favorites. Try again.");
    }
  }, [user, item]);

  return (
    <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
      <LongPressGestureHandler
        onActivated={handleLongPress}
        onEnded={handlePressOut}
        minDurationMs={500}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            key={item.id}
            style={styles.image}
          />

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

export default function HomeScreen() {
  const auth = useAuth();
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const onEndReachedCalled = useRef(false);

  const fetchPosts = async (reset = false) => {
    if (reset) {
      setRefreshing(true);
      setLastDoc(null);
    } else {
      if (!lastDoc) return;
      setLoading(true);
    }

    try {
      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn("No more posts to fetch.");
        setLastDoc(null);
        return;
      }

      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedItem[];

      console.log("Fetched Posts:", newPosts);

      setPosts((prevPosts) => {
        const updatedPosts = reset ? newPosts : [...prevPosts, ...newPosts];

        return updatedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
        );
      });

      setLastDoc(
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null
      );
      setFirstLoad(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (loading || refreshing || !lastDoc || onEndReachedCalled.current) return;

    onEndReachedCalled.current = true;
    fetchPosts(false).then(() => {
      onEndReachedCalled.current = false;
    });
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.welcome}>Welcome,</Text>
        <Text style={styles.user}>
          {auth.user?.email.split("@")[0].charAt(0).toUpperCase() +
            auth.user?.email.split("@")[0].slice(1)}
          !
        </Text>
      </View>
      {firstLoad ? (
        <Loading />
      ) : (
        <FlashList
          data={posts}
          renderItem={({ item }) => <ImageItem item={item} />}
          keyExtractor={(item) => item.id}
          extraData={posts}
          estimatedItemSize={800}
          removeClippedSubviews={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPosts(true)}
            />
          }
        />
      )}
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
  greeting: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingVertical: 2,
    marginLeft: 20,
  },
  welcome: {
    fontFamily: "Factoria-Black",
    fontSize: 30,
    color: "#00003C",
  },
  user: {
    fontFamily: "Stolzl-Bold",
    fontSize: 17,
    color: "#3FBFA8",
  },
});
