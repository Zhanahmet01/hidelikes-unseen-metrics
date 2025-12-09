import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9KtJ-241FQOLzYB_gbN6gUJNFQZXHfis",
  authDomain: "hidelikes.firebaseapp.com",
  databaseURL: "https://hidelikes-default-rtdb.firebaseio.com",
  projectId: "hidelikes",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
