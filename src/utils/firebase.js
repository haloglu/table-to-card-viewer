import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUdu7WGDwnaSJNspCYBeHKfFJtaFfUDLU",
  authDomain: "t2c-products.firebaseapp.com",
  projectId: "t2c-products",
  storageBucket: "t2c-products.firebasestorage.app",
  messagingSenderId: "671024980750",
  appId: "1:671024980750:web:b45bc294709a084396ad5f",
  measurementId: "G-QLNR5Q99RV",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
