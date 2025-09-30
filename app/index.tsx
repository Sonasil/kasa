import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../src/firebase.web";

export default function IndexGate() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Uygulama açıldığında (ve hot-reload’da) oturumu dinle
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setInitializing(false);
    });
    return unsub; // bellek sızıntısı olmasın
  }, []);

  // Dinleme tamamlanana kadar basit loading göster
  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Karar: kullanıcı varsa tabs’e, yoksa login’e
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}