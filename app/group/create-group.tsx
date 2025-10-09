// Dosya: app/group/create-group.tsx
// Adım 3 — Grup oluşturma kurallarına uyum:
// - createdBy: currentUser.uid
// - memberIds: [currentUser.uid] (rules gereği tek üye şartı)
// - Diğer metadata: createdAt, lastActivityAt vb. opsiyonel
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import { db, auth } from '@/src/firebase.web';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function CreateGroupScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const uid = auth.currentUser?.uid;

  const onCreate = async () => {
    if (loading) return;
    const nameNorm = name.trim();

    console.log('[CREATE] uid check =>', auth.currentUser?.uid);
    console.log('[CREATE] name =>', name);
    if (!uid) {
      Alert.alert('Oturum gerekli', 'Grup oluşturmak için giriş yapmalısın.');
      return;
    }
    if (!nameNorm) return;

    setLoading(true);
    try {
      // 1) groups/{id}
      const groupRef = doc(collection(db, 'groups'));
      // ⚖️ Firestore Rules uyumlu payload (memberIds sadece [uid])
      await setDoc(groupRef, {
        name: nameNorm,
        createdBy: uid,
        createdAt: serverTimestamp(),
        memberIds: [uid],
        members: { [uid]: { role: 'admin', joinedAt: serverTimestamp() } },
        balances: { [uid]: 0 },
        lastActivityAt: serverTimestamp(),
      });

      // 2) users/{uid}/groups/{id}
      const userGroupRef = doc(db, 'users', uid, 'groups', groupRef.id);
      await setDoc(userGroupRef, {
        groupId: groupRef.id,
        name: nameNorm,
        role: 'admin',
        joinedAt: serverTimestamp(),
      });

      // 3) Yönlendir
      router.replace(`/group/${groupRef.id}`);
    } catch (e: any) {
      console.error('createGroup error', e);
      Alert.alert('Hata', e?.message || 'Grup oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Grup Oluştur' }} />
      <Text style={styles.label}>Grup Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Ev Arkadaşları"
        value={name}
        onChangeText={setName}
      />
      <Button title={loading ? 'Oluşturuluyor…' : 'Oluştur'} onPress={onCreate} disabled={!name.trim() || loading} />
      <Text style={styles.hint}>Gruplar tabında yeni grubun otomatik listelenecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  label: { fontWeight: '700', color: '#111827' },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
  },
  hint: { color: '#6B7280', marginTop: 8 },
});