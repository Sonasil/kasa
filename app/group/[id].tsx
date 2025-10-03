import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { ChevronLeft, Plus, Info, Users, Send, X, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db, auth } from '@/src/firebase.web';
import { doc, onSnapshot, getDoc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';

type ModalType = 'expense' | 'status' | 'members' | null;

type GroupDoc = {
  name?: string;
  memberIds?: string[];
  totalAmount?: number; // optional; if yoksa 0 gösteririz
  createdBy?: string;   // owner uid
};

export default function GroupDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const groupId = id ? String(id) : undefined;

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState<GroupDoc | null>(null);
  const [leaving, setLeaving] = useState(false);

  // Subscribe to Firestore group doc
  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      setError('Geçersiz grup.');
      return;
    }
    const ref = doc(db, 'groups', groupId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setGroup((snap.data() as GroupDoc) || null);
          setError(null);
        } else {
          setGroup(null);
          setError('Grup bulunamadı.');
        }
        setLoading(false);
      },
      (e) => {
        setError(e?.message || 'Bir hata oluştu');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [groupId]);

  // Derived values for UI (frontend yapısını değiştirmeden)
  const groupName = group?.name || 'Grup Detayı';
  const memberCount = Array.isArray(group?.memberIds) ? group!.memberIds!.length : 0;
  const totalAmount = typeof group?.totalAmount === 'number' ? group!.totalAmount! : 0;
  const memberIds = Array.isArray(group?.memberIds) ? group!.memberIds! : [];

  const uid = auth.currentUser?.uid || null;
  const isOwner = !!uid && !!group?.createdBy && group.createdBy === uid;

  // uid -> { displayName?: string }
  const [userMap, setUserMap] = useState<Record<string, { displayName?: string }>>({});

  // Load users/{uid} docs to show displayName in Members modal
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!memberIds || memberIds.length === 0) {
        setUserMap({});
        return;
      }
      try {
        const snaps = await Promise.all(
          memberIds.map((muid) => getDoc(doc(db, 'users', muid)))
        );
        const map: Record<string, { displayName?: string }> = {};
        snaps.forEach((s) => {
          if (s.exists()) {
            const d = s.data() as any;
            map[s.id] = { displayName: d?.displayName || d?.name };
          }
        });
        if (!cancelled) setUserMap(map);
      } catch (e) {
        if (!cancelled) setUserMap({});
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [memberIds.join('|')]);

  // Loading / Error (görsel düzeni bozmadan basit merkezlenmiş durumlar)
  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#666' }}>Yükleniyor…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <Text style={{ color: '#EF4444', fontWeight: '600' }}>{error}</Text>
        <TouchableOpacity style={{ marginTop: 12 }} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/groups'))}>
          <Text style={{ color: '#4A90E2', fontWeight: '600' }}>Geri dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLeave = async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !groupId || leaving) {
      console.log('[LEAVE] blocked', { groupId, currentUid, leaving });
      return;
    }
    if (!group) {
      Alert.alert('Hata', 'Grup bilgisi yüklenemedi.');
      return;
    }

    try {
      setLeaving(true);
      const members = Array.isArray(group.memberIds) ? [...group.memberIds] : [];
      const remaining = members.filter((m) => m !== currentUid);
      const isOwnerNow = group.createdBy === currentUid;

      console.log('[LEAVE] start', { groupId, currentUid, membersCount: members.length, isOwnerNow });

      // Case 1: Last member -> delete whole group
      if (remaining.length === 0) {
        await deleteDoc(doc(db, 'groups', groupId));
        console.log('[LEAVE] deleted empty group');
        router.replace('/(tabs)/groups');
        return;
      }

      // Case 2: Owner leaving -> transfer ownership to a random remaining member and remove current
      if (isOwnerNow) {
        const newOwner = remaining[Math.floor(Math.random() * remaining.length)];
        await updateDoc(doc(db, 'groups', groupId), {
          createdBy: newOwner,
          memberIds: arrayRemove(currentUid),
        });
        console.log('[LEAVE] transferred ownership to', newOwner);
      } else {
        // Case 3: Regular member leaving -> just remove from memberIds
        await updateDoc(doc(db, 'groups', groupId), {
          memberIds: arrayRemove(currentUid),
        });
        console.log('[LEAVE] removed member');
      }

      router.replace('/(tabs)/groups');
    } catch (e: any) {
      console.error('leave group error', e);
      const msg = typeof e?.message === 'string' ? e.message : 'Gruptan çıkarken bir sorun oluştu.';
      Alert.alert('Çıkılamadı', msg);
    } finally {
      setLeaving(false);
    }
  };

  const confirmLeave = () => {
    const currentUid = auth.currentUser?.uid || null;
    console.log('[LEAVE] confirm tapped', { groupId, currentUid });

    if (!groupId) {
      Alert.alert('Geçersiz grup', 'Geçersiz grup kimliği.');
      return;
    }
    if (!currentUid) {
      Alert.alert('Oturum bulunamadı', 'Lütfen tekrar giriş yapın ve tekrar deneyin.');
      return;
    }

    if (Platform.OS === 'web') {
      // @ts-ignore
      const ok = typeof window !== 'undefined' && window.confirm('Bu gruptan ayrılmak istiyor musun?');
      if (ok) handleLeave();
      return;
    }
    Alert.alert(
      'Gruptan Çık',
      'Bu gruptan ayrılmak istiyor musun?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çık', style: 'destructive', onPress: handleLeave },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/groups'))}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grup Detayı</Text>
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={confirmLeave}
          disabled={leaving}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.leaveText, leaving && { opacity: 0.5 }]}>Gruptan Çık</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.avatar}>
              <View style={styles.avatarIcon} />
            </LinearGradient>
          </View>

          {/* Dinamik isim ve istatistikler */}
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.groupStats}>{memberCount} üye • ₺{totalAmount} toplam</Text>
        </View>

        {/* Aşağıdaki üç kutu görsel olarak korunuyor; değerleri şimdilik sabit (ileri adımda hesap bağlanacak) */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Harcanan</Text>
            <Text style={styles.statValue}>₺180</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Durum</Text>
            <Text style={[styles.statValue, styles.negativeValue]}>₺-43</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Payın</Text>
            <Text style={styles.statValue}>₺138</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('expense')}>
            <Plus size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Harcama</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('status')}>
            <Info size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Durum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('members')}>
            <Users size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Üyeler</Text>
          </TouchableOpacity>
        </View>

        {/* Aktiviteler: frontend korunuyor (dummy içerik) */}
        <View style={styles.activitySection}>
          {/* Aktiviteler bağlandığında listelenecek */}
          <Text style={{ color: '#666' }}>Henüz aktivite yok.</Text>
        </View>
      </ScrollView>

      <View style={styles.messageInput}>
        <TextInput style={styles.input} placeholder="Mesaj yaz..." placeholderTextColor="#999" />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Harcama Modalı */}
      <Modal visible={activeModal === 'expense'} transparent animationType="fade" onRequestClose={() => setActiveModal(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Harcama</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Açıklama</Text>
                <TextInput style={styles.modalInput} placeholder="Market alışverişi" placeholderTextColor="#999" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tutar</Text>
                <TextInput style={styles.modalInput} placeholder="₺150" placeholderTextColor="#999" keyboardType="numeric" />
              </View>
              <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>Harcama Ekle</Text></TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Durum Modalı */}
      <Modal visible={activeModal === 'status'} transparent animationType="fade" onRequestClose={() => setActiveModal(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hesap Durumu</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.statusSummary}>
                <TrendingUp size={32} color="#4A90E2" />
                <Text style={styles.statusTitle}>Toplam Harcama</Text>
                <Text style={styles.statusAmount}>₺{totalAmount}</Text>
              </View>
              <View style={styles.statusList}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#666' }}>Hesaplamalar bağlandığında görünecek.</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Üyeler Modalı */}
      <Modal visible={activeModal === 'members'} transparent animationType="fade" onRequestClose={() => setActiveModal(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Grup Üyeleri</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.membersList}>
                {memberIds.length === 0 ? (
                  <Text style={{ color: '#666' }}>Bu grupta henüz üye yok.</Text>
                ) : (
                  memberIds.map((muid) => {
                    const name = userMap[muid]?.displayName || muid;
                    const initial = (name?.[0] || '?').toUpperCase();
                    return (
                      <View key={muid} style={styles.memberItem}>
                        <View style={[styles.memberAvatar, { backgroundColor: '#4A90E2' }]}>
                          <Text style={styles.memberInitial}>{initial}</Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{name}</Text>
                          <Text style={styles.memberRole}>{muid === group?.createdBy ? 'Grup Sahibi' : 'Üye'}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
              <TouchableOpacity style={styles.addMemberButton}>
                <Plus size={20} color="#4A90E2" />
                <Text style={styles.addMemberText}>Yeni Üye Ekle</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  leaveButton: {
    marginLeft: 'auto',
  },
  leaveText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  groupInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFF',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  groupStats: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  negativeValue: {
    color: '#EF4444',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activitySection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  activityItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarSecondary: {
    backgroundColor: '#10B981',
  },
  userInitial: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSummary: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  statusAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  statusList: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statusItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInitial: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 13,
    color: '#666',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  membersList: {
    gap: 12,
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 13,
    color: '#666',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    gap: 8,
    borderStyle: 'dashed',
  },
  addMemberText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
