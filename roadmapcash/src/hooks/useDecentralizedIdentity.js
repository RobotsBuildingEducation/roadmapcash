import { useState, useEffect, useCallback } from "react";
import { database, doc, getDoc, setDoc } from "@/database/firebaseConfig";
import { bech32 } from "bech32";
import { Buffer } from "buffer";
import { useI18n } from "@/i18n/I18nProvider";

const STORAGE_KEY = "roadmapcash_identity";

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function generatePrivateKey() {
  const privateKeyBytes = new Uint8Array(32);
  crypto.getRandomValues(privateKeyBytes);
  return bytesToHex(privateKeyBytes);
}

async function derivePublicKey(privateKeyHex) {
  const hash = await crypto.subtle.digest("SHA-256", hexToBytes(privateKeyHex));
  return bytesToHex(new Uint8Array(hash));
}

function encodeNsec(privateKeyHex) {
  const bytes = hexToBytes(privateKeyHex);
  const words = bech32.toWords(Buffer.from(bytes));
  return bech32.encode("nsec", words, 1000);
}

function encodeNpub(publicKeyHex) {
  const bytes = hexToBytes(publicKeyHex);
  const words = bech32.toWords(Buffer.from(bytes));
  return bech32.encode("npub", words, 1000);
}

export function useDecentralizedIdentity() {
  const { t } = useI18n();
  const [identity, setIdentity] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const createIdentityFromPrivateKey = useCallback(async (privateKeyHex) => {
    const publicKeyHex = await derivePublicKey(privateKeyHex);
    const nsec = encodeNsec(privateKeyHex);
    const npub = encodeNpub(publicKeyHex);

    return {
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
      nsec,
      npub,
    };
  }, []);

  const fetchOrCreateUser = useCallback(async (npub, isNew = false) => {
    try {
      const userRef = doc(database, "users", npub);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      } else if (isNew) {
        const newUserData = {
          npub,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profile: {
            displayName: "",
            bio: "",
          },
          settings: {},
        };
        await setDoc(userRef, newUserData);
        return newUserData;
      }
      return null;
    } catch (err) {
      console.error("Firestore error:", err);
      throw err;
    }
  }, []);

  const saveToLocalStorage = useCallback((identityData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identityData));
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }, []);

  const decodeNsec = useCallback(
    (nsec) => {
      try {
        const { prefix, words } = bech32.decode(nsec, 1000);
        if (prefix !== "nsec") {
          throw new Error(t("identity.errors.invalidNsecPrefix"));
        }
        const bytes = Buffer.from(bech32.fromWords(words));
        return bytesToHex(bytes);
      } catch (error) {
        throw new Error(t("identity.errors.invalidNsecFormat"));
      }
    },
    [t],
  );


  const initializeIdentity = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedIdentity = loadFromLocalStorage();

      if (storedIdentity) {
        setIdentity(storedIdentity);
        const user = await fetchOrCreateUser(storedIdentity.npub, false);
        if (user) {
          setUserData(user);
        } else {
          const newUser = await fetchOrCreateUser(storedIdentity.npub, true);
          setUserData(newUser);
        }
      } else {
        const privateKeyHex = generatePrivateKey();
        const newIdentity = await createIdentityFromPrivateKey(privateKeyHex);
        setIdentity(newIdentity);
        saveToLocalStorage(newIdentity);
        const newUser = await fetchOrCreateUser(newIdentity.npub, true);
        setUserData(newUser);
      }
    } catch (err) {
      setError(err.message);
      console.error("Identity initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    loadFromLocalStorage,
    createIdentityFromPrivateKey,
    saveToLocalStorage,
    fetchOrCreateUser,
  ]);

  const switchAccount = useCallback(
    async (nsecInput) => {
      setIsLoading(true);
      setError(null);

      try {
        const privateKeyHex = decodeNsec(nsecInput.trim());
        const newIdentity = await createIdentityFromPrivateKey(privateKeyHex);

        let user = await fetchOrCreateUser(newIdentity.npub, false);
        if (!user) {
          user = await fetchOrCreateUser(newIdentity.npub, true);
        }

        saveToLocalStorage(newIdentity);
        setIdentity(newIdentity);
        setUserData(user);

        window.location.reload();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createIdentityFromPrivateKey, fetchOrCreateUser, saveToLocalStorage, decodeNsec]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIdentity(null);
    setUserData(null);
    window.location.reload();
  }, []);

  const updateUserData = useCallback(
    async (updates) => {
      if (!identity?.npub) return;

      try {
        const userRef = doc(database, "users", identity.npub);
        const updatedData = {
          ...userData,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, updatedData, { merge: true });
        setUserData(updatedData);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [identity, userData]
  );

  const saveRoadmap = useCallback(
    async (userInput, financialData, lastUpdatePrompt = null) => {
      if (!identity?.npub) return;

      try {
        const userRef = doc(database, "users", identity.npub);
        const roadmapData = {
          roadmap: {
            userInput,
            financialData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUpdatePrompt,
          },
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, roadmapData, { merge: true });
        setUserData((prev) => ({ ...prev, ...roadmapData }));
        return roadmapData.roadmap;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [identity]
  );

  const getSavedRoadmap = useCallback(() => {
    return userData?.roadmap || null;
  }, [userData]);

  useEffect(() => {
    initializeIdentity();
  }, [initializeIdentity]);

  return {
    identity,
    userData,
    isLoading,
    error,
    switchAccount,
    logout,
    updateUserData,
    saveRoadmap,
    getSavedRoadmap,
    decodeNsec,
    decodeNpub,
  };
}

export default useDecentralizedIdentity;
