import { Stack, Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { db } from "@/src/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TestFirebaseScreen() {
  const [result, setResult] = useState("Test çalıştırılıyor...");

  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, "z_dev_check", "ping");
        await setDoc(ref, { ping: "pong", at: Date.now() }, { merge: true });
        const snap = await getDoc(ref);
        if (snap.exists()) {
          console.log("🔥 Firebase bağlantısı başarılı:", snap.data());
          setResult("Bağlantı başarılı ✅ " + JSON.stringify(snap.data()));
        } else {
          setResult("Doküman bulunamadı ❌");
        }
      } catch (e: any) {
        console.error("⚠️ Firebase bağlantı hatası:", e);
        setResult("Hata ❌ " + (e?.message ?? String(e)));
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Stack.Screen options={{ title: "Firebase Test" }} />
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Firestore test sonucu:</Text>
      <Text selectable style={{ textAlign: "center" }}>{result}</Text>
      <Link href="/" style={{ marginTop: 20 }}>← Ana sayfaya dön</Link>
    </View>
  );
}
