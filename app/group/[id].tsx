import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { ChevronLeft, Plus, Info, Users, Send, X, TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingCart, Zap, Droplets, Car, Home, Utensils, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db, auth } from '@/src/firebase.web';
import { doc, onSnapshot, getDoc, updateDoc, arrayRemove, arrayUnion, deleteDoc, addDoc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot as onColSnapshot, getDocs, where, runTransaction } from 'firebase/firestore';

type ModalType = 'expense' | 'status' | 'members' | null;

type GroupDoc = {
  name?: string;
  memberIds?: string[];
  totalAmount?: number; // optional; if yoksa 0 gösteririz
  createdBy?: string;   // owner uid
  inviteCode?: string;  // opsiyonel davet kodu
  balances?: Record<string, number>; // cents (integer)
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

  // Member management state
  const [addQuery, setAddQuery] = useState(''); // email veya uid
  const [addBusy, setAddBusy] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);

  // Expense form & list state
  type Expense = { id: string; title: string; amount: number; payerUid: string; category?: string; receiptUrl?: string; createdAt?: any };
  type ChatMessage = { id: string; text: string; createdAt?: any; createdBy: string; type?: 'text' | 'expense' };
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState(''); // optional proof URL
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [expenseBusy, setExpenseBusy] = useState(false);
  // Katılımcı çoklu seçimi (varsayılan: sadece current user)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  // Listen expenses under this group
  useEffect(() => {
    if (!groupId) return;
    const ref = collection(db, 'groups', groupId, 'expenses');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onColSnapshot(q, (snap) => {
      const list: Expense[] = snap.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
          title: data?.title ?? data?.description ?? 'Harcama',
          amount: data?.amountCents ? Number(data.amountCents) / 100 : (Number(data?.amount) || 0),
          payerUid: data?.payerUid ?? '',
          category: data?.category ?? null,
          receiptUrl: data?.receiptUrl ?? '',
          createdAt: data?.createdAt,
        } as Expense;
      });
      setExpenses(list);
    });
    return () => unsub();
  }, [groupId]);

  // Listen messages (chat)
  useEffect(() => {
    if (!groupId) return;
    const ref = collection(db, 'groups', groupId, 'messages');
    const q = query(ref, orderBy('createdAt', 'asc'));
    const unsub = onColSnapshot(q, (snap) => {
      const list: ChatMessage[] = snap.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
          text: data?.text || '',
          createdAt: data?.createdAt,
          createdBy: data?.createdBy || '',
          type: data?.type || 'text',
        } as ChatMessage;
      });
      // Order locally by createdAt seconds if present (serverTimestamp gecikmesi için)
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMessages(list);
    });
    return () => unsub();
  }, [groupId]);

  // Harcama modalı açıldığında varsayılan seçim: sadece mevcut kullanıcı
  useEffect(() => {
    if (activeModal === 'expense') {
      const me = auth.currentUser?.uid;
      if (me) setSelectedParticipants([me]);
    }
  }, [activeModal]);

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

  // Balances (kuruş cinsinden)
  const balances = (group?.balances || {}) as Record<string, number>;
  const myUid = auth.currentUser?.uid || '';
  const myBalanceCents = balances[myUid] || 0; // + alacak, - borç

  // Harcama toplamını listeden çıkar (görsel için)
  const spentSumTRY = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const fmtTRY = (v: number) =>
    Number(v).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

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

      // Case 2: Owner leaving but others remain -> block (rules gereği createdBy değiştirilemez)
      if (isOwnerNow && remaining.length > 0) {
        Alert.alert(
          'Önce Sahipliği Devret',
          'Grupta başka üyeler varken ayrılmak için önce sahipliği devretmelisin.'
        );
        setLeaving(false);
        return;
      }

      // Case 3: Regular member leaving -> just remove from memberIds
      await updateDoc(doc(db, 'groups', groupId), {
        memberIds: arrayRemove(currentUid),
      });
      console.log('[LEAVE] removed member');

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

  // Katılımcı seçim yardımcıları
  const toggleParticipant = (uidToToggle: string) => {
    setSelectedParticipants((prev) => {
      const set = new Set(prev);
      if (set.has(uidToToggle)) set.delete(uidToToggle);
      else set.add(uidToToggle);
      return Array.from(set);
    });
  };

  const selectAllParticipants = () => setSelectedParticipants(memberIds);
  const selectOnlyMe = () => {
    const me = auth.currentUser?.uid;
    setSelectedParticipants(me ? [me] : []);
  };

  // Kullanıcıyı email ya da uid ile çöz
  const resolveUserByQuery = async (q: string): Promise<{ uid: string; displayName?: string } | null> => {
    const queryStr = q.trim();
    if (!queryStr) return null;

    // UID gibi görünen (28+ char) doğrudan doküman çek
    if (!queryStr.includes('@')) {
      const s = await getDoc(doc(db, 'users', queryStr));
      if (s.exists()) {
        const d = s.data() as any;
        return { uid: s.id, displayName: d?.displayName || d?.name };
      }
      return null;
    }

    // Email ile arama
    const usersRef = collection(db, 'users');
    const snap = await getDocs(query(usersRef, where('email', '==', queryStr)));
    if (snap.empty) return null;
    const first = snap.docs[0];
    const d = first.data() as any;
    return { uid: first.id, displayName: d?.displayName || d?.name };
  };

  const addMember = async () => {
    if (!groupId) return Alert.alert('Hata', 'Geçersiz grup.');
    if (!isOwner) return Alert.alert('İzin yok', 'Sadece grup sahibi üye ekleyebilir.');
    if (!addQuery.trim()) return Alert.alert('Eksik', 'Eklenecek kişinin emailini veya UID’sini gir.');
    try {
      setAddBusy(true);
      const target = await resolveUserByQuery(addQuery);
      if (!target) {
        Alert.alert('Bulunamadı', 'Bu email/UID ile kayıtlı kullanıcı yok.');
        return;
      }
      if (memberIds.includes(target.uid)) {
        Alert.alert('Zaten üye', 'Bu kullanıcı zaten grupta.');
        return;
      }
      await updateDoc(doc(db, 'groups', groupId), { memberIds: arrayUnion(target.uid) });
      setAddQuery('');
    } catch (e: any) {
      Alert.alert('Eklenemedi', e?.message || 'Üye eklenirken bir hata oluştu.');
    } finally {
      setAddBusy(false);
    }
  };

  const removeMember = async (muid: string) => {
    if (!groupId) return;
    if (!isOwner) return Alert.alert('İzin yok', 'Sadece grup sahibi üye çıkarabilir.');
    if (muid === group?.createdBy) return Alert.alert('İşlem reddedildi', 'Sahip doğrudan çıkarılamaz. Önce sahipliği devret.');
    try {
      await updateDoc(doc(db, 'groups', groupId), { memberIds: arrayRemove(muid) });
    } catch (e: any) {
      Alert.alert('Çıkarılamadı', e?.message || 'Üye çıkarılırken bir hata oluştu.');
    }
  };

  const ensureInviteCode = async () => {
    if (!groupId) return;
    if (!isOwner) return Alert.alert('İzin yok', 'Sadece grup sahibi davet kodu oluşturabilir.');
    if (group?.inviteCode) return; // zaten var
    try {
      setInviteBusy(true);
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      await updateDoc(doc(db, 'groups', groupId), { inviteCode: code });
      // invites/{code} -> { groupId, active, createdAt }
      await setDoc(doc(db, 'invites', code), {
        groupId,
        active: true,
        createdAt: serverTimestamp(),
      });
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Davet kodu oluşturulamadı.');
    } finally {
      setInviteBusy(false);
    }
  };

  const copyInvite = async () => {
    if (!group?.inviteCode) return Alert.alert('Davet kodu yok', 'Önce bir davet kodu oluştur.');
    const inviteText = `${group.inviteCode}`;
    try {
      await Clipboard.setStringAsync(inviteText);
      Alert.alert('Kopyalandı', 'Davet kodu panoya kopyalandı.');
    } catch {}
  };

  const transferOwnership = async (newOwnerUid: string) => {
    if (!groupId) return Alert.alert('Hata', 'Geçersiz grup.');
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return Alert.alert('Oturum bulunamadı', 'Tekrar giriş yapmayı dene.');
    if (!isOwner) return Alert.alert('İzin yok', 'Sadece grup sahibi devredebilir.');
    if (!memberIds.includes(newOwnerUid)) return Alert.alert('Geçersiz seçim', 'Seçilen kişi bu grubun üyesi değil.');
    if (newOwnerUid === group?.createdBy) return Alert.alert('Geçersiz seçim', 'Zaten bu kişi grup sahibi.');

    const targetName = userMap[newOwnerUid]?.displayName || newOwnerUid;
    const doTransfer = async () => {
      try {
        // NOT: Firestore Rules, createdBy değişimine izin vermelidir.
        await updateDoc(doc(db, 'groups', groupId), { createdBy: newOwnerUid });
        Alert.alert('Sahiplik devredildi', `${targetName} artık grup sahibi.`);
      } catch (e: any) {
        const msg = typeof e?.message === 'string' ? e.message : 'Sahiplik devredilemedi.';
        Alert.alert('Hata', msg);
      }
    };

    if (Platform.OS === 'web') {
      // @ts-ignore
      const ok = typeof window !== 'undefined' && window.confirm(`${targetName} kullanıcısına sahipliği devretmek istiyor musun?`);
      if (ok) await doTransfer();
      return;
    }

    Alert.alert(
      'Sahipliği Devret',
      `${targetName} kullanıcısına sahipliği devretmek istiyor musun?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Devret', style: 'destructive', onPress: doTransfer },
      ]
    );
  };

  // Harcamayı ve balances'ı tek transaction içinde güncelle
  const addExpenseWithTransaction = async (params: {
    title: string;
    amountTRY: number;
    payerUid: string;
    participants: string[];
    category?: string | null;
    receiptUrl?: string;
  }) => {
    if (!groupId) throw new Error('Geçersiz grup.');

    const title = params.title.trim();
    if (!title) throw new Error('Başlık gerekli.');
    const totalCents = Math.round(Number(params.amountTRY) * 100);
    if (!Number.isFinite(totalCents) || totalCents <= 0) throw new Error('Geçersiz tutar.');

    // Deterministik bölüşüm: katılımcıları sıralayıp kalan kuruşları baştan dağıt
    const participantIds = [...params.participants].sort();
    const n = participantIds.length;
    if (n === 0) throw new Error('En az bir katılımcı seçilmelidir.');
    const base = Math.floor(totalCents / n);
    let remainder = totalCents - base * n;
    const splitCents: Record<string, number> = {};
    for (const uid of participantIds) {
      const extra = remainder > 0 ? 1 : 0;
      splitCents[uid] = base + extra;
      if (remainder > 0) remainder--;
    }

    const groupRef = doc(db, 'groups', groupId);
    const expensesCol = collection(groupRef, 'expenses');

    await runTransaction(db, async (tx) => {
      const gSnap = await tx.get(groupRef);
      if (!gSnap.exists()) throw new Error('Grup bulunamadı.');
      const g = gSnap.data() as any;
      const memberIdsTx: string[] = Array.isArray(g?.memberIds) ? g.memberIds : [];

      if (!auth.currentUser?.uid || !memberIdsTx.includes(auth.currentUser.uid)) {
        throw new Error('Bu grup için üye değilsin.');
      }
      if (!memberIdsTx.includes(params.payerUid)) {
        throw new Error('Ödeyen grup üyesi olmalı.');
      }
      if (!participantIds.every((u) => memberIdsTx.includes(u))) {
        throw new Error('Katılımcılar grup üyelerinden seçilmeli.');
      }

      // 1) Harcama dokümanı
      const expRef = doc(expensesCol);
      tx.set(expRef, {
        title,
        amountCents: totalCents,
        currency: 'TRY',
        payerUid: params.payerUid,
        participantIds,
        splitCents,
        category: params.category ?? null,
        receiptUrl: (params.receiptUrl || '').trim(),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser!.uid,
        type: 'expense',
      });

      // 2) Balances güncelle (kuruş bazında)
      const balances: Record<string, number> = { ...(g?.balances || {}) };
      const payerShare = splitCents[params.payerUid] || 0;
      balances[params.payerUid] = (balances[params.payerUid] || 0) + (totalCents - payerShare);
      for (const uid of participantIds) {
        if (uid === params.payerUid) continue;
        balances[uid] = (balances[uid] || 0) - (splitCents[uid] || 0);
      }

      // Sadece değişmesi gereken alanları yaz: balances + lastActivityAt
      // Böylece updateMask gereksiz alanları içermez ve kurallar sade kalır.
      tx.set(
        groupRef,
        {
          balances,
          lastActivityAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
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
            <Text style={styles.statValue}>{fmtTRY(spentSumTRY)}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Durum</Text>
            <Text style={[styles.statValue, myBalanceCents < 0 ? styles.negativeValue : null]}>
              {fmtTRY(myBalanceCents / 100)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sana Düşen</Text>
            <Text style={styles.statValue}>{fmtTRY(Math.max(0, -myBalanceCents / 100))}</Text>
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

        <View style={styles.activitySection}>
          {expenses.length === 0 ? (
            <Text style={{ color: '#666' }}>Henüz harcama yok.</Text>
          ) : (
            expenses.map((ex) => (
              <View key={ex.id} style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityUser}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userInitial}>
                        {(userMap[ex.payerUid]?.displayName || ex.payerUid)?.[0]?.toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <Text style={styles.userName}>{userMap[ex.payerUid]?.displayName || ex.payerUid}</Text>
                  </View>
                  <Text style={styles.activityTime}>
                    {ex.createdAt?.toDate ? new Date(ex.createdAt.toDate()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
                <Text style={styles.activityText}>
                  {ex.title} — ₺{ex.amount}
                  {ex.category ? ` • ${ex.category}` : ''}
                </Text>
                {ex.receiptUrl ? (
                  <Text style={{ color: '#4A90E2', marginTop: 8 }} numberOfLines={1}>
                    Fatura: {ex.receiptUrl}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        {/* Chat Section */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={[styles.label, { marginBottom: 8 }]}>Sohbet</Text>
          {messages.length === 0 ? (
            <Text style={{ color: '#666' }}>Henüz mesaj yok.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {messages.map((m) => (
                <View key={m.id} style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>
                    {m.type === 'expense' ? '💸 Harcama' : 'Mesaj'}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#111' }}>
                    {m.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.messageInput, Platform.OS !== 'web' ? { paddingBottom: 12 } : null]}>
        <TextInput style={styles.input} placeholder="Mesaj yaz..." placeholderTextColor="#999" value={messageText} onChangeText={setMessageText} />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={async () => {
            const uidSend = auth.currentUser?.uid;
            if (!uidSend || !groupId) return;
            const text = messageText.trim();
            if (!text) return;
            try {
              await addDoc(collection(db, 'groups', groupId, 'messages'), {
                text,
                createdAt: serverTimestamp(),
                createdBy: uidSend,
                type: 'text',
              });
              setMessageText('');
            } catch (e) {
              Alert.alert('Gönderilemedi', 'Mesaj gönderirken bir sorun oluştu.');
            }
          }}
        >
          <Send size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Harcama Modalı */}
      <Modal visible={activeModal === 'expense'} transparent animationType="fade" onRequestClose={() => setActiveModal(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <Pressable
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => { e.stopPropagation(); }}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Harcama</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Açıklama</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Market alışverişi"
                  placeholderTextColor="#999"
                  value={expenseTitle}
                  onChangeText={setExpenseTitle}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tutar</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="₺150"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                />
              </View>

              <View style={[styles.inputGroup, { marginTop: 4 }]}>
                <Text style={styles.label}>Kategori (opsiyonel)</Text>
                <View style={styles.categoryRow}>
                  {[
                    { key: 'Market', icon: ShoppingCart },
                    { key: 'Elektrik', icon: Zap },
                    { key: 'Su', icon: Droplets },
                    { key: 'Ulaşım', icon: Car },
                    { key: 'Kira', icon: Home },
                    { key: 'Yemek', icon: Utensils },
                  ].map(({ key, icon: Icon }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.categoryChip, expenseCategory === key && styles.categoryChipActive]}
                      onPress={() => setExpenseCategory(expenseCategory === key ? null : key)}
                    >
                      <Icon size={16} color={expenseCategory === key ? '#fff' : '#4A90E2'} />
                      <Text style={[styles.categoryText, expenseCategory === key && { color: '#fff' }]}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fatura (opsiyonel) — URL</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="https://... (Google Drive, iCloud vb.)"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  value={receiptUrl}
                  onChangeText={setReceiptUrl}
                />
              </View>

              {/* Katılımcı seçimi */}
              <View style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={styles.label}>Bu harcamayı kimler paylaşıyor?</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={selectAllParticipants} style={styles.participantShortcutBtn}>
                      <Text style={styles.participantShortcutText}>Herkes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectOnlyMe} style={styles.participantShortcutBtn}>
                      <Text style={styles.participantShortcutText}>Sadece Ben</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.participantRow}>
                  {memberIds.map((muid) => {
                    const name = userMap[muid]?.displayName || muid;
                    const active = selectedParticipants.includes(muid);
                    return (
                      <TouchableOpacity
                        key={muid}
                        onPress={() => toggleParticipant(muid)}
                        style={[styles.participantChip, active && styles.participantChipActive]}
                      >
                        <Text style={[styles.participantChipText, active && { color: '#fff' }]} numberOfLines={1}>
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={{ color: '#666', marginTop: 6 }}>Seçili: {selectedParticipants.length} kişi</Text>
              </View>

              <TouchableOpacity
                style={[styles.modalButton, expenseBusy && { opacity: 0.6 }]}
                disabled={expenseBusy}
                onPress={async () => {
                  console.log('[EXPENSE] submit tapped');
                  const currentUid = auth.currentUser?.uid;
                  if (!currentUid || !groupId) {
                    Alert.alert('Hata', 'Oturum veya grup bulunamadı.');
                    return;
                  }
                  const title = expenseTitle.trim();
                  const amountNum = Number(String(expenseAmount).replace(',', '.'));
                  if (!title || !Number.isFinite(amountNum) || amountNum <= 0) {
                    Alert.alert('Geçersiz', 'Başlık ve tutarı doğru girin.');
                    return;
                  }

                  let participants = selectedParticipants;
                  if (!participants.length) {
                    Alert.alert('Eksik seçim', 'En az bir katılımcı seçmelisin.');
                    return;
                  }
                  if (!participants.includes(currentUid)) {
                    participants = [currentUid, ...participants];
                  }

                  try {
                    setExpenseBusy(true);
                    console.log('[EXPENSE] calling addExpenseWithTransaction', { groupId, title, amountNum, payer: currentUid, participants });
                    await addExpenseWithTransaction({
                      title,
                      amountTRY: amountNum,
                      payerUid: currentUid,
                      participants,
                      category: expenseCategory,
                      receiptUrl: receiptUrl?.trim() || '',
                    });
                    console.log('[EXPENSE] success');
                    // Chat mesajı olarak da düş
                    try {
                      await addDoc(collection(db, 'groups', groupId!, 'messages'), {
                        text: `${title} — ₺${amountNum.toFixed(2)} (paylaşan: ${participants.length} kişi)`,
                        createdAt: serverTimestamp(),
                        createdBy: currentUid,
                        type: 'expense',
                      });
                    } catch (e) {
                      console.warn('[CHAT] expense message create failed', e);
                    }
                    setExpenseTitle('');
                    setExpenseAmount('');
                    setExpenseCategory(null);
                    setReceiptUrl('');
                    setSelectedParticipants([currentUid]);
                    setActiveModal(null);
                  } catch (e: any) {
                    console.error('[EXPENSE] error', e);
                    Alert.alert('Eklenemedi', e?.message || 'Harcama eklenirken bir sorun oluştu.');
                  } finally {
                    setExpenseBusy(false);
                  }
                }}
              >
                {expenseBusy ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Harcama Ekle</Text>
                )}
              </TouchableOpacity>
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
                <Text style={styles.statusAmount}>{fmtTRY(spentSumTRY)}</Text>
              </View>
              <View style={styles.statusList}>
                {memberIds.length === 0 ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>Üye bulunamadı.</Text>
                  </View>
                ) : (
                  memberIds.map((muid) => {
                    const name = userMap[muid]?.displayName || muid;
                    const initial = (name?.[0] || '?').toUpperCase();
                    const cents = balances[muid] || 0;
                    const positive = cents > 0;
                    return (
                      <View key={muid} style={styles.statusItem}>
                        <View style={styles.statusItemLeft}>
                          <View style={[styles.statusAvatar, { backgroundColor: positive ? '#10B981' : '#EF4444' }]}> 
                            <Text style={styles.statusInitial}>{initial}</Text>
                          </View>
                          <View>
                            <Text style={styles.statusName}>{name}</Text>
                            <Text style={styles.statusSubtext}>{positive ? 'Alacaklı' : (cents === 0 ? 'Dengede' : 'Borçlu')}</Text>
                          </View>
                        </View>
                        <View style={styles.statusRight}>
                          {positive ? <ArrowUpRight size={18} color="#10B981" /> : (cents < 0 ? <ArrowDownRight size={18} color="#EF4444" /> : null)}
                          <Text style={[styles.statusValue, { color: positive ? '#10B981' : (cents < 0 ? '#EF4444' : '#111') }]}>
                            {fmtTRY(cents / 100)}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
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
                    const isOwnerBadge = muid === group?.createdBy;
                    return (
                      <View key={muid} style={styles.memberItem}>
                        <View style={[styles.memberAvatar, { backgroundColor: '#4A90E2' }]}> 
                          <Text style={styles.memberInitial}>{initial}</Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{name}</Text>
                          <Text style={styles.memberRole}>{isOwnerBadge ? 'Grup Sahibi' : 'Üye'}</Text>
                        </View>
                        {isOwner && !isOwnerBadge && (
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                              onPress={() => transferOwnership(muid)}
                              style={styles.memberTransferBtn}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Crown size={18} color="#F59E0B" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => removeMember(muid)}
                              style={styles.memberRemoveBtn}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <X size={18} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </View>

              {/* Davet kodu / link alanı */}
              <View style={{ gap: 8, marginBottom: 16 }}>
                <Text style={styles.label}>Davet Kodu</Text>
                {group?.inviteCode ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>{group.inviteCode}</Text>
                    </View>
                    <TouchableOpacity onPress={copyInvite} style={[styles.addMemberButton, { borderStyle: 'solid', paddingVertical: 12, paddingHorizontal: 16 }]}>
                      <Text style={styles.addMemberText}>Kopyala</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity disabled={inviteBusy || !isOwner} onPress={ensureInviteCode} style={[styles.addMemberButton, { opacity: inviteBusy || !isOwner ? 0.6 : 1 }]}>
                    <Plus size={20} color="#4A90E2" />
                    <Text style={styles.addMemberText}>Davet Kodu Oluştur</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Üye ekleme alanı */}
              <View style={{ gap: 8 }}>
                <Text style={styles.label}>Üye Ekle (email veya UID)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    placeholder="ornek@eposta.com veya uid"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    value={addQuery}
                    onChangeText={setAddQuery}
                  />
                  <TouchableOpacity disabled={addBusy || !isOwner} onPress={addMember} style={[styles.addMemberButton, { borderStyle: 'solid', paddingVertical: 12, paddingHorizontal: 16, opacity: addBusy || !isOwner ? 0.6 : 1 }]}>
                    <Text style={styles.addMemberText}>{addBusy ? 'Ekleniyor…' : 'Ekle'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  memberRemoveBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  memberTransferBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
  },
  categoryChipActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  participantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  participantChip: {
    maxWidth: '48%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
  },
  participantChipActive: {
    backgroundColor: '#4A90E2',
  },
  participantChipText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  participantShortcutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  participantShortcutText: {
    color: '#4A90E2',
    fontWeight: '700',
    fontSize: 12,
  },
});
