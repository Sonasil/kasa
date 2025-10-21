import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { FilterButton } from '@/components/FilterButton';
import { ExpenseCard } from '@/components/ExpenseCard';

import { auth, db } from '@/src/firebase.web';
import {
  collectionGroup,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit as qlimit,
} from 'firebase/firestore';


type FilterType = 'all' | 'spent' | 'incoming';

  type UIExpense = {
    id: string;
    title: string;
    amountTRY: number; // amountCents / 100
    payerUid: string;
    groupId: string;
    createdAt?: any;
  };

export default function KasaScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const [uid, setUid] = useState<string | null>(null);
  const [expensesMine, setExpensesMine] = useState<UIExpense[]>([]); // I am participant
  const [expensesIPaid, setExpensesIPaid] = useState<UIExpense[]>([]); // I am payer
  const [groupsMap, setGroupsMap] = useState<Record<string, { name: string; balances?: Record<string, number> }>>({});

  // Greeting name
  const displayName = auth.currentUser?.displayName || 'Sen';

  useEffect(() => {
    const u = auth.currentUser?.uid || null;
    setUid(u);
  }, []);

  useEffect(() => {
    if (!uid) return;
    const qGroups = query(collection(db, 'groups'), where('memberIds', 'array-contains', uid));
    const unsub = onSnapshot(qGroups, (snap) => {
      const map: Record<string, { name: string; balances?: Record<string, number> }> = {};
      snap.forEach((d) => {
        const data: any = d.data();
        map[d.id] = { name: data?.name || 'Grup', balances: data?.balances || {} };
      });
      setGroupsMap(map);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    // 1) Benim katıldıklarım
    const qPart = query(
      collectionGroup(db, 'expenses'),
      where('participantIds', 'array-contains', uid),
      orderBy('createdAt', 'desc'),
      qlimit(20)
    );
    const unsub1 = onSnapshot(qPart, (snap) => {
      const list: UIExpense[] = snap.docs.map((d) => {
        const data: any = d.data();
        const parent = d.ref.parent; // expenses
        const groupId = parent.parent?.id || '';
        return {
          id: d.id,
          title: data?.title || 'Harcama',
          amountTRY: data?.amountCents ? Number(data.amountCents) / 100 : Number(data?.amount || 0),
          payerUid: data?.payerUid || '',
          groupId,
          createdAt: data?.createdAt,
        };
      });
      setExpensesMine(list);
    });

    // 2) Benim ödediğimler
    const qPaid = query(
      collectionGroup(db, 'expenses'),
      where('payerUid', '==', uid),
      orderBy('createdAt', 'desc'),
      qlimit(20)
    );
    const unsub2 = onSnapshot(qPaid, (snap) => {
      const list: UIExpense[] = snap.docs.map((d) => {
        const data: any = d.data();
        const parent = d.ref.parent; // expenses
        const groupId = parent.parent?.id || '';
        return {
          id: d.id,
          title: data?.title || 'Harcama',
          amountTRY: data?.amountCents ? Number(data.amountCents) / 100 : Number(data?.amount || 0),
          payerUid: data?.payerUid || '',
          groupId,
          createdAt: data?.createdAt,
        };
      });
      setExpensesIPaid(list);
    });

    return () => { unsub1(); unsub2(); };
  }, [uid]);

  const merged = useMemo(() => {
    const map = new Map<string, UIExpense>();
    [...expensesMine, ...expensesIPaid].forEach((e) => { map.set(e.id + '|' + e.groupId, e); });
    const arr = Array.from(map.values());
    // Sort by createdAt desc if available
    arr.sort((a, b) => {
      const ta = (a.createdAt?.seconds || 0);
      const tb = (b.createdAt?.seconds || 0);
      return tb - ta;
    });
    return arr;
  }, [expensesMine, expensesIPaid]);

  const getFilteredExpenses = () => {
    if (!uid) return [] as UIExpense[];
    switch (activeFilter) {
      case 'spent':
        return merged.filter((e) => e.payerUid === uid);
      case 'incoming':
        return merged.filter((e) => e.payerUid !== uid);
      default:
        return merged;
    }
  };

  const getTotalBalance = () => {
    if (!uid) return 0;
    const cents = Object.entries(groupsMap).reduce((sum, [, g]) => {
      const b = g.balances?.[uid] || 0;
      return sum + Number(b);
    }, 0);
    return Math.round(cents) / 100; // TRY
  };

  const balance = getTotalBalance();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Merhaba{displayName ? `, ${displayName}!` : '!'}</Text>
        {/* 3 Kutu Başlangıç */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#F1F5F9' }]}>
            <Text style={styles.summaryLabel}>Harcanan</Text>
            <Text style={styles.summaryValue}>
              {merged.filter(e => e.payerUid === uid).reduce((sum, e) => sum + e.amountTRY, 0).toFixed(2)} ₺
            </Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.summaryLabel}>Durum</Text>
            <Text
              style={[
                styles.summaryValue,
                balance > 0
                  ? styles.positiveBalance
                  : balance < 0
                  ? styles.negativeBalance
                  : styles.neutralBalance,
              ]}
            >
              {balance} ₺
            </Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.summaryLabel}>Gelen</Text>
            <Text style={styles.summaryValue}>
              {Math.max(0, getTotalBalance()).toFixed(2)} ₺
            </Text>
          </View>
        </View>
        {/* 3 Kutu Bitiş */}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <FilterButton
            title="Tümü"
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterButton
            title="Harcanan"
            active={activeFilter === 'spent'}
            onPress={() => setActiveFilter('spent')}
          />
          <FilterButton
            title="gelen"
            active={activeFilter === 'incoming'}
            onPress={() => setActiveFilter('incoming')}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Son Harcamalar</Text>

        {getFilteredExpenses().map((expense) => (
          <ExpenseCard
            key={`${expense.groupId}_${expense.id}`}
            title={expense.title}
            amount={expense.amountTRY}
            paidBy={expense.payerUid === uid ? 'Sen' : 'Diğer'}
            date={expense.createdAt?.toDate ? expense.createdAt.toDate().toISOString().slice(0,10) : ''}
            groupName={groupsMap[expense.groupId]?.name || 'Grup'}
          />
        ))}

        {getFilteredExpenses().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Bu filtrede harcama bulunamadı</Text>
          </View>
        )}
        
        <View style={styles.bottomPadding} />

        
      </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  balance: {
    fontSize: 18,
    fontWeight: '700',
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filters: {
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  bottomPadding: {
    height: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});