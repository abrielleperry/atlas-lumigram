// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7lFnWo9hvkffprktSEayJWH_fx9M4Lw4",
  authDomain: "lumigram-aperry.firebaseapp.com",
  projectId: "lumigram-aperry",
  storageBucket: "lumigram-aperry.firebasestorage.app",
  messagingSenderId: "592468291719",
  appId: "1:592468291719:web:d70bd948e14c3fdc160822",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
