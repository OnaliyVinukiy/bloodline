import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2t4WXPruIObsCX1ec5u05_s-H2oZqEKY",
  authDomain: "bloodline-2dbfa.firebaseapp.com",
  projectId: "bloodline-2dbfa",
  storageBucket: "bloodline-2dbfa.firebasestorage.app",
  messagingSenderId: "149492002067",
  appId: "1:149492002067:web:87996e24e7c50de865bee6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
