import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/firebaseConfig";
import Loading from "@/components/Loading";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface FeedItem {
  id: string;
  image: string;
  caption: string;
}

const PAGE_SIZE = 10;

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
  );
};

export default function Page() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const onEndReachedCalled = useRef(false);
  const fetchFavorites = async (reset = false) => {
    if (!user) return;

    if (reset) {
      setRefreshing(true);
      setLastDoc(null);
    } else {
      if (!lastDoc) return;
      setLoading(true);
    }

    try {
      let q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid),
        orderBy("favoritedAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setLastDoc(null);
        return;
      }

      const newFavorites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedItem[];

      setFavorites((prevFavorites) => {
        const updatedFavorites = reset
          ? newFavorites
          : [...prevFavorites, ...newFavorites];

        return updatedFavorites.filter(
          (fav, index, self) => index === self.findIndex((f) => f.id === fav.id)
        );
      });

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (loading || refreshing || !lastDoc || onEndReachedCalled.current) return;

    onEndReachedCalled.current = true;
    fetchFavorites(false).then(() => {
      onEndReachedCalled.current = false;
    });
  };

  useEffect(() => {
    fetchFavorites(true);
  }, []);

  if (loading && favorites.length === 0) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={favorites}
        renderItem={({ item }) => <ImageItem item={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={800}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchFavorites(true)}
          />
        }
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
    height: 390,
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
