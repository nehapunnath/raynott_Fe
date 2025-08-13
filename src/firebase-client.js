// firebase-client.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEgfdqNdNJwY15a54JdABOUFY3qmF6kkc",
  authDomain: "raynott-98db5.firebaseapp.com",
  projectId: "raynott-98db5",
  storageBucket: "raynott-98db5.appspot.com", // fixed .app to .appspot.com
  messagingSenderId: "34805454717",
  appId: "1:34805454717:web:545267e51d8884e3af5e14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
