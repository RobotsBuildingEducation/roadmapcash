import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getGenerativeModel, getVertexAI, Schema } from "@firebase/vertexai";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "roadmapcash.firebaseapp.com",
  projectId: "roadmapcash",
  storageBucket: "roadmapcash.firebasestorage.app",
  messagingSenderId: "311920816757",
  appId: "1:311920816757:web:c5f94d2cc9078ced723e3c",
  measurementId: "G-MTTTLY5PW0",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

const vertexAI = getVertexAI(app, { location: "global" });
export const ai = vertexAI;

const simplemodel = getGenerativeModel(vertexAI, {
  model: "gemini-3-flash-preview",
});

export { database, doc, getDoc, setDoc, simplemodel };
