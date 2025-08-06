import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Users, Plus, UserPlus } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const mockGroups = [
  { id: '1', name: 'Hafta Sonu Gezisi', balance: 120, members: 4 },
  { id: '2', name: 'Ev Arkadaşları', balance: -45, members: 3 },
  { id: '3', name: 'Proje Grubu', balance: 0, members: 5 },
  { id: '4', name: 'Çalışma Grubu', balance: 25, members: 6 },
];

export default function GroupsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gruplarım</Text>
        <Text style={styles.subtitle}>Katıldığın grupları yönet</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockGroups.map((group) => (
          <TouchableOpacity 
            key={group.id}
            onPress={() => router.push(`/group/${group.id}`)}
            activeOpacity={0.7}
          >
            <Card>
              <View style={styles.groupCard}>
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeader}>
                    <View style={styles.groupIcon}>
                      <Users color="#10B981" size={20} />
                    </View>
                    <View>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{group.members} üye</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.balanceContainer}>
                  <Text style={[
                    styles.balance,
                    group.balance > 0 ? styles.positiveBalance : 
                    group.balance < 0 ? styles.negativeBalance : styles.neutralBalance
                  ]}>
                    {group.balance > 0 ? `+₺${group.balance}` : 
                     group.balance < 0 ? `₺${group.balance}` : '₺0'}
                  </Text>
                  <Text style={styles.balanceLabel}>
                    {group.balance > 0 ? 'alacağın var' : 
                     group.balance < 0 ? 'borcun var' : 'eşit'}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button
          title="Grup Oluştur"
          onPress={() => router.push('/create-group')}
          variant="primary"
          style={styles.actionButton}
        />
        <Button
          title="Gruba Katıl"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
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
});