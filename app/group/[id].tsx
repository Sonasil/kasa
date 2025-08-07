import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Pressable,
  Vibration,
  Dimensions,
} from 'react-native';
import { ChevronLeft, Plus, Info, Users, Smile } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const initialMessages = [
  { id: '1', sender: 'Ali', message: 'Market alışverişi yaptım, fişi ekledim', timestamp: '2024-01-15T10:30:00', isSystem: false },
  { id: '2', sender: 'System', message: 'Ali "Market Alışverişi" harcamasını ekledi - ₺150', timestamp: '2024-01-15T10:31:00', isSystem: true },
  { id: '3', sender: 'Ayşe', message: 'Teşekkürler! Ben de benzin parasını ekleyeceğim', timestamp: '2024-01-15T11:00:00', isSystem: false },
  { id: '4', sender: 'System', message: 'Ayşe "Benzin" harcamasını ekledi - ₺200', timestamp: '2024-01-15T11:05:00', isSystem: true },
];

const groupOwner = 'Ali';
const groupMembers = ['Ali', 'Ayşe', 'Mehmet', 'Sen'];
const groupName = 'Hafta Sonu Gezisi';
const groupAvatar = '🌄';
const totalAmount = 550;
const yourSpent = 180;
const yourShare = 137.5;
const yourBalance = -42.5; // negative: you owe, positive: you are owed

// Animated number hook
function useAnimatedNumber(target: number, duration = 800) {
  const animated = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(animated, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start();
    const id = animated.addListener(({ value }) => setDisplay(Number(value.toFixed(0))));
    return () => animated.removeListener(id);
  }, [target]);
  return display;
}

export default function GroupDetailScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [modalAnim] = useState(new Animated.Value(0));

  // Animated numbers for summary
  const animatedSpent = useAnimatedNumber(yourSpent);
  const animatedBalance = useAnimatedNumber(yourBalance);
  const animatedShare = useAnimatedNumber(yourShare);

  // Modal animation
  const openModal = (setter: (v: boolean) => void) => {
    setter(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = (setter: (v: boolean) => void) => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setter(false));
  };

  // Haptic feedback
  const haptic = () => Vibration.vibrate(8);

  // Add expense
  const handleAddExpense = () => {
    if (!expenseTitle.trim() || !expenseAmount.trim()) return;
    haptic();
    const user = 'Sen';
    const now = new Date().toISOString();
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: user,
        message: `"${expenseTitle}" harcamasını ekledim - ₺${expenseAmount}`,
        timestamp: now,
        isSystem: false,
      },
      {
        id: Math.random().toString(),
        sender: 'System',
        message: `Sen "${expenseTitle}" harcamasını ekledi - ₺${expenseAmount}`,
        timestamp: now,
        isSystem: true,
      }
    ]);
    setExpenseTitle('');
    setExpenseAmount('');
    closeModal(setShowAddExpense);
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    haptic();
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'Sen',
        message: newMessage,
        timestamp: new Date().toISOString(),
        isSystem: false,
      }
    ]);
    setNewMessage('');
  };

  // Copy message
  const handleCopy = (id: string, text: string) => {
    haptic();
    setCopiedMsgId(id);
    if (navigator?.clipboard) navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedMsgId(null), 1200);
  };

  // Summary box
  const renderSummaryBox = (label: string, value: string | number, valueColor?: string) => (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryBoxLabel}>{label}</Text>
      <Text style={[styles.summaryBoxValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );

  // Action button
  const renderActionButton = (label: string, Icon: any, onPress: () => void) => (
    <Pressable
      style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
      android_ripple={{ color: '#1e40af' }}
      onPress={() => { haptic(); onPress(); }}
    >
      <Icon color="#fff" size={20} style={{ marginBottom: 4 }} />
      <Text style={styles.actionButtonText}>{label}</Text>
    </Pressable>
  );

  // Message bubble
  const renderMessage = ({ item }: any) => (
    <Pressable
      onLongPress={() => handleCopy(item.id, item.message)}
      style={({ pressed }) => [
        item.isSystem ? styles.systemMessage : styles.userMessage,
        pressed && { opacity: 0.7 },
        copiedMsgId === item.id && { borderColor: '#10B981', borderWidth: 1.5 },
      ]}
    >
      {!item.isSystem && (
        <View style={styles.msgHeader}>
          <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.sender[0]}</Text></View>
          <Text style={styles.messageSender}>{item.sender}</Text>
        </View>
      )}
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
      {copiedMsgId === item.id && (
        <Text style={styles.copiedText}>Kopyalandı!</Text>
      )}
    </Pressable>
  );

  // Modal animated style
  const modalStyle = {
    transform: [{ translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }],
    opacity: modalAnim,
  };

  // Example debts for Durum modal (in a real app, this would be calculated)
  const memberDebts = [
    { name: 'Ali', avatar: '🧑‍🦱', amount: -30 }, // you owe Ali 30
    { name: 'Ayşe', avatar: '👩', amount: 50 },  // Ayşe owes you 50
    { name: 'Mehmet', avatar: '🧔', amount: 0 }, // settled
    { name: 'Sen', avatar: '🧑', amount: 0 },    // yourself
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlurWrap}>
        <View style={styles.headerGradient} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBack} onPress={() => { haptic(); router.back(); }}>
            <ChevronLeft color="#111827" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Grup Detayı</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCardWrap}>
        <View style={styles.summaryCardGlass}>
          <View style={styles.groupAvatarWrap}>
            <Text style={styles.groupAvatar}>{groupAvatar}</Text>
          </View>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.groupInfo}>{groupMembers.length} üye • ₺{totalAmount} toplam</Text>
          <View style={styles.summaryRow}>
            {renderSummaryBox('Harcanan', `₺${animatedSpent}`)}
            {renderSummaryBox('Durum', `₺${animatedBalance}`, animatedBalance >= 0 ? '#10B981' : '#EF4444')}
            {renderSummaryBox('Payın', `₺${animatedShare}`)}
          </View>
        </View>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        {renderActionButton('Harcama', Plus, () => openModal(setShowAddExpense))}
        {renderActionButton('Durum', Info, () => openModal(setShowStatus))}
        {renderActionButton('Üyeler', Users, () => openModal(setShowMembers))}
      </View>

      {/* Chat List */}
      <View style={styles.chatListContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Mesaj yaz..."
              value={newMessage}
              onChangeText={setNewMessage}
              placeholderTextColor="#6B7280"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Smile color={newMessage.trim() ? "#2563EB" : "#9CA3AF"} size={22} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Harcama Ekle Modal */}
      <Modal visible={showAddExpense} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalStyle]}>
            <Text style={styles.modalTitle}>Harcama Ekle</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Başlık"
              value={expenseTitle}
              onChangeText={setExpenseTitle}
              placeholderTextColor="#6B7280"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Tutar (₺)"
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={handleAddExpense}>
                <Text style={styles.modalButtonPrimaryText}>Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => closeModal(setShowAddExpense)}>
                <Text style={styles.modalButtonSecondaryText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Durum Modal (replace old modal) */}
      <Modal visible={showStatus} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalStyle]}>
            <Text style={styles.modalTitle}>Kime Ne Kadar?</Text>
            <View style={{ width: '100%', marginTop: 8 }}>
              {memberDebts.filter(m => m.name !== 'Sen').map((m, i) => (
                <View key={m.name} style={styles.debtRow}>
                  <View style={styles.debtAvatar}><Text style={styles.debtAvatarText}>{m.avatar}</Text></View>
                  <Text style={styles.debtName}>{m.name}</Text>
                  {m.amount === 0 ? (
                    <View style={[styles.debtBadge, { backgroundColor: '#F3F4F6' }]}><Text style={styles.debtBadgeText}>Eşit</Text></View>
                  ) : m.amount > 0 ? (
                    <View style={[styles.debtBadge, { backgroundColor: '#10B98122' }]}><Text style={[styles.debtBadgeText, { color: '#10B981' }]}>{m.name} sana ₺{m.amount} borçlu</Text></View>
                  ) : (
                    <View style={[styles.debtBadge, { backgroundColor: '#EF444422' }]}><Text style={[styles.debtBadgeText, { color: '#EF4444' }]}>Sen {m.name}'ye ₺{Math.abs(m.amount)} borçlusun</Text></View>
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => closeModal(setShowStatus)}>
              <Text style={styles.modalButtonPrimaryText}>Kapat</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Üyeler Modal (replace old modal) */}
      <Modal visible={showMembers} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalStyle]}>
            <Text style={styles.modalTitle}>Üyeler</Text>
            <View style={styles.membersGrid}>
              {groupMembers.map((member, i) => (
                <View key={member} style={styles.memberCard}>
                  <View style={styles.memberAvatarWrap}>
                    <Text style={styles.memberAvatar}>{memberDebts.find(m => m.name === member)?.avatar || '👤'}</Text>
                  </View>
                  <Text style={styles.memberName}>{member}</Text>
                  {member === groupOwner && (
                    <View style={styles.ownerBadge}><Text style={styles.ownerBadgeText}>Grup Sahibi</Text></View>
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => closeModal(setShowMembers)}>
              <Text style={styles.modalButtonPrimaryText}>Kapat</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e7ef',
  },
  // Header
  headerBlurWrap: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    height: 80,
    backgroundColor: 'linear-gradient(90deg, #e0e7ef 0%, #fff 100%)',
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  headerBack: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  // Summary Card
  summaryCardWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 24,
    overflow: 'visible',
  },
  summaryCardGlass: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(203,213,225,0.18)',
    backdropFilter: 'blur(8px)', // for web, ignored on native
  },
  groupAvatarWrap: {
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  groupAvatar: {
    fontSize: 28,
    color: '#fff',
  },
  groupName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  groupInfo: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
    width: '100%',
  },
  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(243,244,246,0.85)',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(203,213,225,0.10)',
  },
  summaryBoxLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  summaryBoxValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  // Action Row
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'linear-gradient(90deg, #2563EB 0%, #1e40af 100%)',
    borderRadius: 16,
    padding: 8,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'column',
    marginHorizontal: 2,
    backgroundColor: 'rgba(37,99,235,0.95)',
    shadowColor: '#2563EB',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 1,
  },
  actionButtonPressed: {
    backgroundColor: '#1e40af',
    opacity: 0.85,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  // Chat List
  chatListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: 'linear-gradient(90deg, #f3f4f6 0%, #fff 100%)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    minWidth: 80,
    maxWidth: width * 0.8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  systemMessage: {
    backgroundColor: 'rgba(243,244,246,0.95)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    minWidth: 80,
    maxWidth: width * 0.8,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  msgAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  msgAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  messageSender: {
    fontWeight: '700',
    color: '#2563EB',
    fontSize: 13,
  },
  messageText: {
    color: '#111827',
    fontSize: 15,
  },
  messageTimestamp: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  copiedText: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    maxHeight: 80,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 20,
    padding: 28,
    minWidth: 320,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(203,213,225,0.18)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    color: '#111827',
    width: 220,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  modalButtonSecondaryText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  debtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  debtAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  debtAvatarText: {
    fontSize: 18,
  },
  debtName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 15,
    flex: 1,
  },
  debtBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtBadgeText: {
    fontWeight: '600',
    fontSize: 13,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  memberCard: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 12,
    margin: 6,
    minWidth: 90,
    maxWidth: 110,
    shadowColor: '#2563EB',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  memberAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  memberAvatar: {
    fontSize: 20,
    color: '#fff',
  },
  memberName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 15,
    marginBottom: 2,
  },
  ownerBadge: {
    backgroundColor: '#2563EB22',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  ownerBadgeText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 11,
  },
});