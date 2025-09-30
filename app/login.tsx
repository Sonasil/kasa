import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Wallet } from "lucide-react-native";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { auth } from "../src/firebase.web"; // 🔑 auth buradan geliyor
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrMsg(null);

    // basit doğrulama
    if (!email.trim() || !password) {
      setErrMsg("E-posta ve şifre gerekli.");
      return;
    }

    try {
      setLoading(true);
      // Firebase Auth ile giriş
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // başarılı → tabs'e geç
      router.replace("/(tabs)");
    } catch (err: any) {
      // Hata mesajını kullanıcı dostu göster
      let msg = "Giriş başarısız.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") msg = "E-posta veya şifre hatalı.";
      if (err.code === "auth/user-not-found") msg = "Bu e-posta ile kullanıcı bulunamadı.";
      if (err.code === "auth/too-many-requests") msg = "Çok fazla deneme. Lütfen sonra tekrar deneyin.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Wallet {...({ size: 32, color: "#10B981" } as { size: number; color: string })} />
          </View>
          <Text style={styles.title}>Kasa</Text>
          <Text style={styles.subtitle}>Grup harcamalarını kolayca takip et</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Şifre"
            placeholder="Şifrenizi girin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Hata mesajı */}
          {errMsg ? <Text style={styles.error}>{errMsg}</Text> : null}

          <Button
            title={loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          />

          {loading ? <ActivityIndicator /> : null}

          <TouchableOpacity onPress={() => router.push("/register")} style={styles.createAccountButton}>
            <Text style={styles.createAccountText}>
              Hesabın yok mu? <Text style={styles.createAccountLink}>Hesap Oluştur</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logoContainer: { alignItems: "center", marginBottom: 48 },
  logo: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  title: { fontSize: 32, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  form: { width: "100%" },
  loginButton: { marginTop: 8, marginBottom: 24 },
  createAccountButton: { alignItems: "center" },
  createAccountText: { fontSize: 14, color: "#6B7280" },
  createAccountLink: { color: "#10B981", fontWeight: "600" },
  error: { color: "#EF4444", marginTop: 8, marginBottom: 8 },
});
