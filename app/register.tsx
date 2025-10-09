import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { auth } from "../src/firebase.web"; // 🔑 auth buradan geliyor
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { db } from "../src/firebase.web";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrMsg(null);

    // basit doğrulamalar
    if (!name.trim()) return setErrMsg("Ad Soyad gerekli.");
    if (!email.trim()) return setErrMsg("E-posta gerekli.");
    if (password.length < 6) return setErrMsg("Şifre en az 6 karakter olmalı.");

    try {
      setLoading(true);

      // 0) E-postayı normalize et (iyi pratik): küçük harf, trim
      const emailNorm = email.trim().toLowerCase();

      // 1) Firebase'de kullanıcı oluştur
      const cred = await createUserWithEmailAndPassword(auth, emailNorm, password);

      // 2) Profiline ad-soyad yaz (displayName)
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }

      // 3) Firestore'da users/{uid} dokümanı oluştur
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid, // iyi pratik: verinin içinde de uid olsun
        displayName: name.trim(),
        // Bazı durumlarda cred.user.email anında dolmayabilir; garanti için fallback kullan
        email: (cred.user.email ?? emailNorm).toLowerCase(),
        createdAt: serverTimestamp(),
      });
      // ✅ users koleksiyonuna başarıyla eklendi
      console.log("Yeni kullanıcı Firestore'a kaydedildi:", cred.user.uid);

      // 4) Başarılı → tabs'e yönlendir
      router.replace("/(tabs)");
    } catch (err: any) {
      // geliştirici log'u: gerçek hata kodu ve mesajı
      console.error("register error:", err?.code, err?.message);

      let msg = "Kayıt başarısız.";
      // yaygın hata kodlarını kullanıcı dostu çevir
      if (err.code === "auth/email-already-in-use") msg = "Bu e-posta zaten kayıtlı.";
      if (err.code === "auth/invalid-email") msg = "Geçersiz e-posta.";
      if (err.code === "auth/weak-password") msg = "Şifre zayıf. En az 6 karakter olmalı.";
      if (err.code === "auth/operation-not-allowed") msg = "E-posta/Şifre yöntemi kapalı. Console'dan etkinleştir.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Hesap Oluştur" showBack />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Kasa'ya katıl ve arkadaşlarınla harcamaları paylaş
        </Text>

        <View style={styles.form}>
          <Input
            label="Ad Soyad"
            placeholder="Adınızı ve soyadınızı girin"
            value={name}
            onChangeText={setName}
          />

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
            placeholder="Bir şifre oluşturun"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {errMsg ? <Text style={styles.error}>{errMsg}</Text> : null}

          <Button
            title={loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
            onPress={handleRegister}
            style={styles.registerButton}
            disabled={loading}
          />

          {loading ? <ActivityIndicator /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  form: { width: "100%" },
  registerButton: { marginTop: 8 },
  error: { color: "#EF4444", marginTop: 8, marginBottom: 8 },
});
