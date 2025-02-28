import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  async function login() {
    setLoading(true);
    try {
      await auth.login(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      alert("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.atlasSchoolContainer}>
        <Text style={styles.atlasText}>Atlas</Text>
        <Text style={styles.schoolText}>SCHOOL</Text>
      </View>
      <Text style={styles.loginText}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#FFFFFF"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.signInButton} onPress={login}>
        <Text style={styles.signInText}>Sign In</Text>
      </Pressable>

      <Pressable
        style={styles.newAccountButton}
        onPress={() => router.replace("/register")}
      >
        <Text style={styles.newAccountText}>Create a new account</Text>
      </Pressable>
      {loading && <Loading />}
      {/*
      <Link href="/register" replace>
        <Text>Create a new account</Text>
      </Link>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00003C",
  },
  atlasSchoolContainer: {
    position: "relative",
    alignItems: "flex-start",
  },
  atlasText: {
    fontSize: 90,
    fontFamily: "Factoria-Black",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  schoolText: {
    fontSize: 26,
    fontFamily: "Stolzl-Bold",
    color: "#3FBFA8",
    position: "absolute",
    bottom: 0,
    right: 0,
    letterSpacing: 3,
  },
  loginText: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 15,
    fontFamily: "Space-Mono-Regular",
    fontWeight: "bold",
  },

  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#00003C",
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: "#3FBFA8",
    borderWidth: 1,
    color: "#FFFFFF",
  },
  signInButton: {
    width: "80%",
    height: 47,
    backgroundColor: "#3FBFA8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 10,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  newAccountButton: {
    width: "80%",
    height: 47,
    backgroundColor: "#00003C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 10,

    borderColor: "#000000",
    borderWidth: 1,
  },
  newAccountText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
