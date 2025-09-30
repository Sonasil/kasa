import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router, Redirect } from "expo-router";
import {
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  CircleHelp as HelpCircle,
  CreditCard,
} from "lucide-react-native";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

import { auth } from "@/src/firebase.web";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  reload,
  User,
} from "firebase/auth";

type ProfileOptionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const [curUser, setCurUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Oturum durumunu dinle
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurUser(u ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const displayName = useMemo(() => {
    if (!curUser) return "";
    if (curUser.displayName && curUser.displayName.trim().length > 0) {
      return curUser.displayName.trim();
    }
    if (curUser.email) return curUser.email.split("@")[0];
    return "Kullanıcı";
  }, [curUser]);

  const emailText = curUser?.email ?? "—";
  const statusText = curUser?.emailVerified ? "Doğrulandı" : "Doğrulanmadı";

  async function doLogout() {
    try {
      await signOut(auth);
      router.replace("/login"); // index gate de login'e yönlendirecek
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Çıkış yapılamadı.");
    }
  }

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const ok = window.confirm("Çıkış yapmak istediğinden emin misin?");
      if (ok) void doLogout();
    } else {
      Alert.alert("Çıkış Yap", "Çıkış yapmak istediğinden emin misin?", [
        { text: "İptal", style: "cancel" },
        { text: "Çıkış Yap", style: "destructive", onPress: () => void doLogout() },
      ]);
    }
  };

  async function handleSendVerification() {
    if (!auth.currentUser) return;
    try {
      setSending(true);
      await sendEmailVerification(auth.currentUser);
      Alert.alert(
        "E-posta gönderildi",
        "Gelen kutunu kontrol et ve doğrulama bağlantısını tıkla."
      );
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Doğrulama e-postası gönderilemedi.");
    } finally {
      setSending(false);
    }
  }

  async function handleRefreshVerification() {
    if (!auth.currentUser) return;
    try {
      setRefreshing(true);
      await reload(auth.currentUser);
      // reload sonrası currentUser güncellenir
      setCurUser(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        Alert.alert("Başarılı", "E-posta adresiniz doğrulandı 🎉");
      } else {
        Alert.alert("Henüz doğrulanmadı", "Doğrulama bağlantısına tıklayıp tekrar deneyin.");
      }
    } catch (e: any) {
      Alert.alert("Hata", e?.message ?? "Durum yenilenemedi.");
    } finally {
      setRefreshing(false);
    }
  }

  const ProfileOption = ({ icon, title, subtitle, onPress }: ProfileOptionProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.profileOption}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIcon}>{icon}</View>
            <View>
              <Text style={styles.optionTitle}>{title}</Text>
              {subtitle ? <Text style={styles.optionSubtitle}>{subtitle}</Text> : null}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  // İlk açılışta auth durumunu bekliyoruz
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  // Kullanıcı yoksa login'e gönder (index gate de bunu yapıyor; burada da koruma olsun)
  if (!curUser) {
    return <Redirect href="/login" />;
  }

  const verified = !!curUser.emailVerified;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <UserIcon color="#6B7280" size={32} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{emailText}</Text>
              <Text
                style={[
                  styles.userStatus,
                  { color: verified ? "#10B981" : "#F59E0B" },
                ]}
              >
                {verified ? "Doğrulandı" : "Hesabınız doğrulanmadı"}
              </Text>

              {!verified && (
                <View style={styles.verifyBox}>
                  <Button
                    title={sending ? "E-posta Gönderiliyor..." : "E-postamı Doğrula"}
                    onPress={handleSendVerification}
                    disabled={sending}
                    style={styles.smallVerifyButton}
                    variant="outline"
                  />
                  <TouchableOpacity
                    onPress={handleRefreshVerification}
                    disabled={refreshing}
                  >
                    <Text style={styles.refreshLink}>
                      {refreshing ? "Yenileniyor..." : "Zaten doğruladım"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Card>

        <View style={styles.options}>
          <ProfileOption
            icon={<Bell color="#6B7280" size={20} />}
            title="Bildirimler"
            subtitle="Harcama ve ödeme bildirimleri"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<CreditCard color="#6B7280" size={20} />}
            title="Ödeme Yöntemleri"
            subtitle="Kart ve hesap bilgileri"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<Settings color="#6B7280" size={20} />}
            title="Ayarlar"
            subtitle="Uygulama tercihleri"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<HelpCircle color="#6B7280" size={20} />}
            title="Yardım ve Destek"
            subtitle="SSS ve iletişim"
            onPress={() => {}}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Çıkış Yap"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            leftIcon={<LogOut color="#EF4444" size={16} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  userCard: { marginBottom: 24 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  userDetails: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 4 },
  userEmail: { fontSize: 14, color: "#6B7280", marginBottom: 2 },
  userStatus: { fontSize: 12, fontWeight: "500" },
  options: { flex: 1 },
  profileOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionTitle: { fontSize: 16, fontWeight: "500", color: "#111827", marginBottom: 2 },
  optionSubtitle: { fontSize: 13, color: "#6B7280" },
  logoutContainer: { paddingVertical: 20 },
  logoutButton: { borderColor: "#EF4444" },
  verifyBox: { marginTop: 8, gap: 8 },
  smallVerifyButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  refreshLink: {
    color: "#9CA3AF",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "400",
  },
});