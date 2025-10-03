import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { db, auth } from '@/src/firebase.web';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Ekranda göstereceğimiz minimal tip
type UIGroup = {
  id: string;
  name: string;
  balance: number;
  members: number;
};

export default function GroupsScreen() {
  const [groups, setGroups] = useState<UIGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [refreshing, setRefreshing] = useState(false);
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!uid) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log('[LIST] uid check =>', uid);

    // Üye olduğun grupları real-time dinle
    const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: UIGroup[] = snap.docs.map((d) => {
          const data: any = d.data();
          const memberIds: string[] = Array.isArray(data?.memberIds) ? data.memberIds : [];
          const balanceByUser = data?.balances?.[uid] ?? 0;
          return {
            id: d.id,
            name: data?.name ?? 'Adsız Grup',
            balance: Number(balanceByUser) || 0,
            members: memberIds.length,
          };
        });
        setGroups(list);
        setLoading(false);
      },
      (err) => {
        console.error('groups listen error', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const confirmDelete = (groupId: string, groupName: string) => {
    Alert.alert(
      'Grubu Sil',
      `"${groupName}" grubunu silmek istediğine emin misin?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => handleDelete(groupId),
        },
      ]
    );
  };

  const handleDelete = async (groupId: string) => {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
    } catch (e) {
      console.error('delete group error', e);
      Alert.alert('Silinemedi', 'Bu grubu silerken bir sorun oluştu.');
    }
  };

  const isEmpty = !loading && groups.length === 0;

  const onRefresh = () => {
    if (loading) return;
    setRefreshing(true);
    // we already have a live listener; just show a brief refresh state
    setTimeout(() => setRefreshing(false), 500);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator />
          <Text style={styles.centerText}>Gruplar yükleniyor…</Text>
        </View>
      );
    }

    if (!groups.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Henüz bir grubun yok</Text>
          <Text style={styles.emptyText}>Bir grup oluşturabilir veya davet kodu ile bir gruba katılabilirsin.</Text>
          <Button
            title="Grup Oluştur"
            onPress={() => router.push('/group/create-group')}
            variant="primary"
            style={{ marginTop: 12, width: '100%' }}
          />
          <Button
            title="Gruba Katıl"
            onPress={() => router.push('/join-group')}
            variant="outline"
            style={{ marginTop: 8, width: '100%' }}
          />
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          // @ts-ignore React Native types in web/Expo may differ; this is safe in app
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            onPress={() => router.push(`/group/${group.id}`)}
            onLongPress={() => confirmDelete(group.id, group.name)}
            activeOpacity={0.7}
          >
            <Card>
              <View style={styles.groupCard}>
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeader}>
                    <View style={styles.groupIcon}>
                      <Users size={20} />
                    </View>
                    <View>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{group.members} üye</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.balanceContainer}>
                  <Text
                    style={[
                      styles.balance,
                      group.balance > 0
                        ? styles.positiveBalance
                        : group.balance < 0
                        ? styles.negativeBalance
                        : styles.neutralBalance,
                    ]}
                  >
                    {formatCurrency(group.balance)}
                  </Text>
                  <Text style={styles.balanceLabel}>
                    {group.balance > 0 ? 'alacağın var' : group.balance < 0 ? 'borcun var' : 'eşit'}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gruplarım</Text>
        <Text style={styles.subtitle}>Katıldığın grupları yönet</Text>
      </View>

      {renderContent()}

      {!isEmpty && (
        <View style={styles.bottomButtons}>
          <Button
            title="Grup Oluştur"
            onPress={() => router.push('/group/create-group')}
            variant="primary"
            style={styles.actionButton}
          />
          <Button
            title="Gruba Katıl"
            onPress={() => router.push('/join-group')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  groupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    color: '#10B981',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  positiveBalance: {
    color: '#10B981',
  },
  negativeBalance: {
    color: '#EF4444',
  },
  neutralBalance: {
    color: '#6B7280',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomPadding: {
    height: 20,
  },
  bottomButtons: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  // Eklenen yardımcı stiller (frontend'i bozmaz)
  centerBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    marginTop: 8,
    color: '#6B7280',
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});