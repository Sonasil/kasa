import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus, ArrowRight, Send, MessageCircle } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { ExpenseCard } from '@/components/ExpenseCard';
import { ChatMessage } from '@/components/ChatMessage';

const mockExpenses = [
  { id: '1', title: 'Market Alışverişi', amount: 150, paidBy: 'Ali', date: '2024-01-15' },
  { id: '2', title: 'Benzin', amount: 200, paidBy: 'Ayşe', date: '2024-01-14' },
  { id: '3', title: 'Yemek', amount: 80, paidBy: 'Mehmet', date: '2024-01-13' },
];

const mockDebts = [
  { from: 'Ali', to: 'Ayşe', amount: 20 },
  { from: 'Mehmet', to: 'Ali', amount: 35 },
  { from: 'Sen', to: 'Ayşe', amount: 15 },
];

const mockMessages = [
  { id: '1', sender: 'Ali', message: 'Market alışverişi yaptım, fişi ekledim', timestamp: '2024-01-15T10:30:00', isSystem: false },
  { id: '2', sender: 'System', message: 'Ali "Market Alışverişi" harcamasını ekledi - ₺150', timestamp: '2024-01-15T10:31:00', isSystem: true },
  { id: '3', sender: 'Ayşe', message: 'Teşekkürler! Ben de benzin parasını ekleyeceğim', timestamp: '2024-01-15T11:00:00', isSystem: false },
  { id: '4', sender: 'System', message: 'Ayşe "Benzin" harcamasını ekledi - ₺200', timestamp: '2024-01-15T11:05:00', isSystem: true },
];

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Mock send message
      setNewMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Hafta Sonu Gezisi" 
        showBack 
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/add-expense')}>
            <Plus color="#10B981" size={24} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Harcamalar</Text>
        
        {mockExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            title={expense.title}
            amount={expense.amount}
            paidBy={expense.paidBy}
            date={expense.date}
          />
        ))}
        
        <Button
          title="Harcama Ekle"
          onPress={() => router.push('/add-expense')}
          style={styles.addExpenseButton}
        />
        
        <Text style={styles.sectionTitle}>Hesaplaşma</Text>
        
        {mockDebts.map((debt, index) => (
          <Card key={index}>
            <View style={styles.debtCard}>
              <Text style={styles.debtText}>
                <Text style={styles.debtPerson}>{debt.from}</Text>
                {' → '}
                <Text style={styles.debtPerson}>{debt.to}</Text>
              </Text>
              
              <Text style={styles.debtAmount}>₺{debt.amount}</Text>
            </View>
          </Card>
        ))}
        
        <View style={styles.chatSection}>
          <View style={styles.chatHeader}>
            <MessageCircle color="#6B7280" size={20} />
            <Text style={styles.sectionTitle}>Grup Sohbeti</Text>
          </View>
          
          <Card style={styles.chatContainer}>
            <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
              {mockMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  sender={message.sender}
                  message={message.message}
                  timestamp={message.timestamp}
                  isSystem={message.isSystem}
                />
              ))}
            </ScrollView>
            
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Mesaj yaz..."
                value={newMessage}
                onChangeText={setNewMessage}
                placeholderTextColor="#9CA3AF"
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send color={newMessage.trim() ? "#10B981" : "#D1D5DB"} size={20} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
        
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
    marginTop: 8,
  },
  addExpenseButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  debtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  debtPerson: {
    fontWeight: '600',
    color: '#111827',
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  chatSection: {
    marginTop: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chatContainer: {
    height: 300,
    padding: 0,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    maxHeight: 80,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  bottomPadding: {
    height: 20,
  },
});