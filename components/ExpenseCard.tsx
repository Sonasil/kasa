import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Receipt } from 'lucide-react-native';
import { Card } from './Card';

interface ExpenseCardProps {
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  groupName?: string;
  onPress?: () => void;
}

export function ExpenseCard({ title, amount, paidBy, date, groupName, onPress }: ExpenseCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const content = (
    <View style={styles.expenseCard}>
      <View style={styles.expenseIcon}>
        <Receipt color="#6B7280" size={20} />
      </View>
      
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseTitle}>{title}</Text>
        <Text style={styles.expenseDetails}>
          {paidBy} tarafından ödendi
          {groupName && ` • ${groupName}`}
        </Text>
      </View>
      
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>₺{amount}</Text>
        <Text style={styles.expenseDate}>{formatDate(date)}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card>
          {content}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card>
      {content}
    </Card>
  );
}

const styles = StyleSheet.create({
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  expenseDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});