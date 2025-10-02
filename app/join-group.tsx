// Dosya: app/join-group.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import { db, auth } from '@/src/firebase.web';
import {
  collection, doc, query, where, getDocs, updateDoc, serverTimestamp, setDoc
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

      const normalized = code.trim().toUpperCase();
      if (!normalized) throw new Error('Davet kodu gerekli.');

      // 1) Koda göre grup ara
      const q = query(collection(db, 'groups'), where('inviteCode', '==', normalized));
      const snap = await getDocs(q);
      if (snap.empty) throw new Error('Geçersiz davet kodu');

      const g = snap.docs[0];
      const ref = g.ref;
      const data: any = g.data();

      // 2) Zaten üyeyse direkt yönlendir
      if ((data.memberIds || []).includes(uid)) {
        router.replace(`/group/${g.id}`);
        return;
      }

      // 3) Üye olarak ekle + kullanıcı aynasını yaz
      await updateDoc(ref, {
        memberIds: [...(data.memberIds || []), uid],
        [`members.${uid}`]: { role: 'member', joinedAt: serverTimestamp() },
        [`balances.${uid}`]: 0,
        lastActivityAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'users', uid, 'groups', g.id), {
        groupId: g.id,
        name: data.name,
        role: 'member',
        joinedAt: serverTimestamp(),
      });

      // 4) Grup sayfasına git
      router.replace(`/group/${g.id}`);
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