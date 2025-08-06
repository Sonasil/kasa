import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { FilterButton } from '@/components/FilterButton';
import { ExpenseCard } from '@/components/ExpenseCard';

const mockExpenses = [
  { id: '1', title: 'Market Alışverişi', amount: 120, paidBy: 'Ali', date: '2024-01-15', groupName: 'Ev Arkadaşları' },
  { id: '2', title: 'Pizza Siparişi', amount: 85, paidBy: 'Ayşe', date: '2024-01-14', groupName: 'Proje Grubu' },
  { id: '3', title: 'Benzin', amount: 200, paidBy: 'Mehmet', date: '2024-01-13', groupName: 'Hafta Sonu Gezisi' },
  { id: '4', title: 'Kahve', amount: 45, paidBy: 'Sen', date: '2024-01-12', groupName: 'Çalışma Grubu' },
  
];

type FilterType = 'all' | 'spent' | 'incoming';

export default function KasaScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getFilteredExpenses = () => {
    switch (activeFilter) {
      case 'spent':
        return mockExpenses.filter(expense => expense.paidBy === 'Sen');
  
      case 'incoming':
        // Show expenses paid to others
        return mockExpenses.filter(expense => expense.paidBy !== 'Sen');
      default:
        return mockExpenses;
    }
  };

  const getTotalBalance = () => {
    const totalSpent = mockExpenses
      .filter(expense => expense.paidBy === 'Sen')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalOwed = mockExpenses
      .filter(expense => expense.paidBy !== 'Sen')
      .reduce((sum, expense) => sum + (expense.amount / 4), 0); // Assuming 4 people per group
    
    return totalSpent - totalOwed;
  };

  const balance = getTotalBalance();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Merhaba, Ahmet!</Text>
        {/* 3 Kutu Başlangıç */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#F1F5F9' }]}>
            <Text style={styles.summaryLabel}>Harcanan</Text>
            <Text style={styles.summaryValue}>
              {mockExpenses.filter(e => e.paidBy === 'Sen').reduce((sum, e) => sum + e.amount, 0)} ₺
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
              {mockExpenses.filter(e => e.paidBy !== 'Sen').reduce((sum, e) => sum + (e.amount / 4), 0)} ₺
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
            key={expense.id}
            title={expense.title}
            amount={expense.amount}
            paidBy={expense.paidBy}
            date={expense.date}
            groupName={expense.groupName}
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