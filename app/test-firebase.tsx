import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { db } from "../src/firebase.web"; // şimdilik web dosyasını doğrudan import et
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TestFirebaseScreen() {
  const [result, setResult] = useState("Bağlantı test ediliyor...");

  useEffect(() => {
    const runTest = async () => {
      try {
        // Firestore'a test dokümanı yaz
        const ref = doc(db, "z_dev_check", "ping");
        await setDoc(ref, { ping: "pong", at: Date.now() }, { merge: true });

        // Sonra oku
        const snap = await getDoc(ref);
        if (snap.exists()) {
          console.log("🔥 Firebase bağlantısı başarılı:", snap.data());
          setResult("🔥 Bağlantı başarılı: " + JSON.stringify(snap.data()));
        } else {
          setResult("❌ Doküman bulunamadı");
        }
      } catch (err: any) {
        console.error("⚠️ Firebase hatası:", err);
        setResult("⚠️ Firebase hatası: " + err.message);
      }
    };

    runTest();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{result}</Text>
    </View>
  );
}
