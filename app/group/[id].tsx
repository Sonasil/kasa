import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { ChevronLeft, Plus, Info, Users, Send, X, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ModalType = 'expense' | 'status' | 'members' | null;

export default function GroupDetail() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grup Detayı</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.avatar}
            >
              <View style={styles.avatarIcon} />
            </LinearGradient>
          </View>

          <Text style={styles.groupName}>ömsmsd</Text>
          <Text style={styles.groupStats}>1 üye • ₺550 toplam</Text>
        </View>

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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveModal('expense')}
          >
            <Plus size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Harcama</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveModal('status')}
          >
            <Info size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Durum</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveModal('members')}
          >
            <Users size={20} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonText}>Üyeler</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitySection}>
          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityUser}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>A</Text>
                </View>
                <Text style={styles.userName}>Ali</Text>
              </View>
              <Text style={styles.activityTime}>10:30</Text>
            </View>
            <Text style={styles.activityText}>Market alışverişi yaptım, fişi ekledim</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityUser}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>A</Text>
                </View>
                <Text style={styles.userName}>Ali</Text>
              </View>
              <Text style={styles.activityTime}>10:31</Text>
            </View>
            <Text style={styles.activityText}>
              "Market Alışverişi" harcamasını ekledi - ₺150
            </Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.activityUser}>
                <View style={[styles.userAvatar, styles.userAvatarSecondary]}>
                  <Text style={styles.userInitial}>A</Text>
                </View>
                <Text style={styles.userName}>Ayşe</Text>
              </View>
              <Text style={styles.activityTime}>11:00</Text>
            </View>
            <Text style={styles.activityText}>
              Teşekkürler! Ben de benzin parasını ekleyeceğim
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.messageInput}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yaz..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={activeModal === 'expense'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Harcama</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Açıklama</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Market alışverişi"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tutar</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="₺150"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Harcama Ekle</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'status'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hesap Durumu</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.statusSummary}>
                <TrendingUp size={32} color="#4A90E2" />
                <Text style={styles.statusTitle}>Toplam Harcama</Text>
                <Text style={styles.statusAmount}>₺550</Text>
              </View>

              <View style={styles.statusList}>
                <View style={styles.statusItem}>
                  <View style={styles.statusItemLeft}>
                    <View style={[styles.statusAvatar, { backgroundColor: '#4A90E2' }]}>
                      <Text style={styles.statusInitial}>A</Text>
                    </View>
                    <View>
                      <Text style={styles.statusName}>Ali</Text>
                      <Text style={styles.statusSubtext}>Ödedi: ₺180</Text>
                    </View>
                  </View>
                  <View style={styles.statusRight}>
                    <ArrowDownRight size={16} color="#EF4444" />
                    <Text style={[styles.statusValue, { color: '#EF4444' }]}>-₺43</Text>
                  </View>
                </View>

                <View style={styles.statusItem}>
                  <View style={styles.statusItemLeft}>
                    <View style={[styles.statusAvatar, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.statusInitial}>A</Text>
                    </View>
                    <View>
                      <Text style={styles.statusName}>Ayşe</Text>
                      <Text style={styles.statusSubtext}>Ödedi: ₺370</Text>
                    </View>
                  </View>
                  <View style={styles.statusRight}>
                    <ArrowUpRight size={16} color="#10B981" />
                    <Text style={[styles.statusValue, { color: '#10B981' }]}>+₺95</Text>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'members'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Grup Üyeleri</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.membersList}>
                <View style={styles.memberItem}>
                  <View style={[styles.memberAvatar, { backgroundColor: '#4A90E2' }]}>
                    <Text style={styles.memberInitial}>A</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>Ali</Text>
                    <Text style={styles.memberRole}>Grup Sahibi</Text>
                  </View>
                </View>

                <View style={styles.memberItem}>
                  <View style={[styles.memberAvatar, { backgroundColor: '#10B981' }]}>
                    <Text style={styles.memberInitial}>A</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>Ayşe</Text>
                    <Text style={styles.memberRole}>Üye</Text>
                  </View>
                </View>
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
