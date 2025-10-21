// Dosya: app/join-group.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import { db, auth } from '@/src/firebase.web';
import {
  doc, getDoc, updateDoc, serverTimestamp, setDoc, arrayUnion, addDoc, collection
} from 'firebase/firestore';

export default function JoinGroupScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onJoin = async () => {
    setLoading(true);
    setErr(null);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Giriş yapmalısın.');

      const normalized = code.replace(/\s|-/g, '').trim().toUpperCase();
      if (!normalized) throw new Error('Davet kodu gerekli.');

      // 1) Koda göre groupId bul (invites/{code}) — groups okumaya gerek yok
      const invSnap = await getDoc(doc(db, 'invites', normalized));
      if (!invSnap.exists()) throw new Error('Geçersiz davet kodu');
      const groupId = invSnap.data()?.groupId as string | undefined;
      if (!groupId) throw new Error('Davet kaydında groupId eksik');

      // 2) Self-join: sadece memberIds değişir (rules buna izin veriyor)
      try {
        await updateDoc(doc(db, 'groups', groupId), {
          memberIds: arrayUnion(uid),
        });
      } catch (joinErr: any) {
        // Eğer zaten üyeyse update reddedilir; bu durumda üyeysek grup okunabilir olmalı
        try {
          const probe = await getDoc(doc(db, 'groups', groupId));
          if (probe.exists()) {
            const gdata: any = probe.data();
            const groupNameProbe = gdata?.name as string | undefined;
            // users/{uid}/groups/{groupId} eşlemesini de garanti altına al
            try {
              await setDoc(doc(db, 'users', uid, 'groups', groupId), {
                groupId,
                name: groupNameProbe,
                role: 'member',
                joinedAt: serverTimestamp(),
              }, { merge: true });
            } catch {}
            router.replace(`/group/${groupId}`);
            return;
          }
        } catch {}
        throw joinErr;
      }

      // 2.5) Chat'e otomatik katılım mesajı bırak
      try {
        const displayName = auth.currentUser?.displayName || 'Bir üye';
        await addDoc(collection(db, 'groups', groupId, 'messages'), {
          text: `${displayName} gruba katıldı` ,
          createdAt: serverTimestamp(),
          createdBy: uid,
          type: 'text',
        });
      } catch (e) {
        console.warn('[JOIN] chat welcome failed', e);
      }
      // 3) Artık üyeyiz; grup adını çekip kullanıcı altına yaz (opsiyonel)
      let groupName: string | undefined = undefined;
      try {
        const gSnap = await getDoc(doc(db, 'groups', groupId));
        groupName = (gSnap.exists() ? (gSnap.data() as any)?.name : undefined) as string | undefined;
      } catch {}

      await setDoc(doc(db, 'users', uid, 'groups', groupId), {
        groupId,
        name: groupName,
        role: 'member',
        joinedAt: serverTimestamp(),
      });

      // 4) Grup sayfasına git
      router.replace(`/group/${groupId}`);
    } catch (e: any) {
      setErr(e?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Gruba Katıl' }} />
      <Text style={styles.label}>Davet Kodu</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: 7K2FQ9"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />
      {err ? <Text style={styles.err}>{err}</Text> : null}
      <Button title={loading ? 'Katılıyor…' : 'Katıl'} onPress={onJoin} disabled={!code || loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  label: { fontWeight: '700', color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  err: { color: '#EF4444' },
});