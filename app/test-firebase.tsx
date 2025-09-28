import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
// Şimdilik web'den çalıştığın için direkt web dosyasını çağır
import { db } from "../src/firebase.web";

export default function TestFirebaseScreen() {
  const [result, setResult] = useState("⏳ Firestore bağlantısı test ediliyor...");

  useEffect(() => {
    const runTest = async () => {
      try {
        // Firestore'a test dokümanı yaz
        const ref = doc(db, "z_dev_check", "ping");
        await setDoc(ref, { ping: "pong", at: Date.now() }, { merge: true });

        // Dokümanı geri oku
        const snap = await getDoc(ref);
        if (snap.exists()) {
          console.log("🔥 Firestore bağlantısı başarılı:", snap.data());
          setResult("🔥 Bağlantı başarılı → " + JSON.stringify(snap.data()));
        } else {
          setResult("❌ Doküman bulunamadı");
        }
      } catch (err: any) {
        console.error("⚠️ Firestore hatası:", err);
        setResult("⚠️ Firestore hatası: " + err.message);
      }
    };

    runTest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
