import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { Link, router, useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.atlasSchoolContainer}>
        <Text style={styles.atlasText}>Atlas</Text>
        <Text style={styles.schoolText}>SCHOOL</Text>
      </View>
      <Text style={styles.registerText}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        secureTextEntry
      />
      <Pressable
        style={styles.createAccountButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.createAccountText}>Create Account</Text>
      </Pressable>

      <Pressable
        style={styles.existingAccountButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.existingAccountText}>
          Login to existing account
        </Text>
      </Pressable>
      {/*
      <Link href="/login" replace>
        <Text>Log in into existing account</Text>
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
  registerText: {
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
  createAccountButton: {
    width: "80%",
    height: 47,
    backgroundColor: "#3FBFA8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 10,
  },
  createAccountText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  existingAccountButton: {
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
  existingAccountText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
