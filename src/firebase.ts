import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk8g9uCDteP0SMOyPvWiPVqcF4WlgXbBg",
  authDomain: "blackouts-cc54e.firebaseapp.com",
  projectId: "blackouts-cc54e",
  storageBucket: "blackouts-cc54e.firebasestorage.app",
  messagingSenderId: "785463801679",
  appId: "1:785463801679:web:8c709e4726c3845bb6773a",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, app, db };
