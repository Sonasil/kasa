import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Check, ChevronDown } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';

const mockUsers = [
  { id: '1', name: 'Ali', selected: true },
  { id: '2', name: 'Ayşe', selected: true },
  { id: '3', name: 'Mehmet', selected: false },
  { id: '4', name: 'Sen', selected: true },
];

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Sen');
  const [participants, setParticipants] = useState(mockUsers);
  const [showPaidBySelector, setShowPaidBySelector] = useState(false);

  const toggleParticipant = (userId: string) => {
    setParticipants(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const handleSave = () => {
    // Mock save - go back
    router.back();
  };

  const selectedCount = participants.filter(p => p.selected).length;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Harcama Ekle" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            label="Harcama Başlığı"
            placeholder="Ne için ödeme yaptın?"
            value={title}
            onChangeText={setTitle}
          />
          
          <Input
            label="Tutar (₺)"
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <Text style={styles.sectionLabel}>Kim ödedi?</Text>
          <TouchableOpacity onPress={() => setShowPaidBySelector(!showPaidBySelector)}>
            <Card style={styles.selectorCard}>
              <View style={styles.selectorRow}>
                <Text style={styles.selectorText}>{paidBy}</Text>
                <ChevronDown color="#6B7280" size={20} />
              </View>
            </Card>
          </TouchableOpacity>
          
          {showPaidBySelector && (
            <Card style={styles.optionsCard}>
              {mockUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.option}
                  onPress={() => {
                    setPaidBy(user.name);
                    setShowPaidBySelector(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    paidBy === user.name && styles.selectedOptionText
                  ]}>
                    {user.name}
                  </Text>
                  {paidBy === user.name && (
                    <Check color="#10B981" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          )}
          
          <Text style={styles.sectionLabel}>Kimler arasında bölünsün?</Text>
          <Card style={styles.participantsCard}>
            {participants.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.participantOption}
                onPress={() => toggleParticipant(user.id)}
              >
                <Text style={styles.participantText}>{user.name}</Text>
                <View style={[
                  styles.checkbox,
                  user.selected && styles.checkedBox
                ]}>
                  {user.selected && (
                    <Check color="#FFFFFF" size={16} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Card>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {selectedCount} kişi arasında bölünecek
            </Text>
            <Text style={styles.summaryAmount}>
              Kişi başı: ₺{amount ? (parseFloat(amount) / selectedCount).toFixed(0) : '0'}
            </Text>
          </View>
          
          <Button
            title="Harcamayı Kaydet"
            onPress={handleSave}
            style={styles.saveButton}
            disabled={!title.trim() || !amount.trim() || selectedCount === 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  form: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  selectorCard: {
    padding: 16,
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#111827',
  },
  optionsCard: {
    padding: 0,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
  participantsCard: {
    padding: 0,
    marginBottom: 16,
  },
  participantOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  participantText: {
    fontSize: 16,
    color: '#374151',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  summaryCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  saveButton: {
    marginTop: 8,
  },
});