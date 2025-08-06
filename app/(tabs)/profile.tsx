import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { User, Settings, LogOut, Bell, CircleHelp as HelpCircle, CreditCard } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => router.replace('/login')
        }
      ]
    );
  };

  const ProfileOption = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.profileOption}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIcon}>
              {icon}
            </View>
            <View>
              <Text style={styles.optionTitle}>{title}</Text>
              {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User color="#6B7280" size={32} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Ahmet Yılmaz</Text>
              <Text style={styles.userEmail}>ahmet@universite.edu.tr</Text>
              <Text style={styles.userStatus}>Öğrenci</Text>
            </View>
          </View>
        </Card>

        <View style={styles.options}>
          <ProfileOption
            icon={<Bell color="#6B7280" size={20} />}
            title="Bildirimler"
            subtitle="Harcama ve ödeme bildirimleri"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={<CreditCard color="#6B7280" size={20} />}
            title="Ödeme Yöntemleri"
            subtitle="Kart ve hesap bilgileri"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={<Settings color="#6B7280" size={20} />}
            title="Ayarlar"
            subtitle="Uygulama tercihleri"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={<HelpCircle color="#6B7280" size={20} />}
            title="Yardım ve Destek"
            subtitle="SSS ve iletişim"
            onPress={() => {}}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Çıkış Yap"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  userCard: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  options: {
    flex: 1,
  },
  profileOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutContainer: {
    paddingVertical: 20,
  },
  logoutButton: {
    borderColor: '#EF4444',
  },
});