import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext<AuthContextType>({ register, logout, login });

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  user?: User | null;
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);

async function register(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userId = userCredential.user.uid;

  // generate default "username" in "users" collection from email prefix
  const defaultUsername = email.split("@")[0];

  //  store "username" and "profilePicture" in "users" collection
  await setDoc(doc(db, "users", userId), {
    username: defaultUsername,
    profilePicture: "",
  });

  console.log("User registered and Firestore document created:", userId);

  return userCredential;
}

function logout() {
  return auth.signOut();
}

function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}
