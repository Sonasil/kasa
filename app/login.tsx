import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Wallet } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login - navigate to tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Wallet color="#10B981" size={32} />
          </View>
          <Text style={styles.title}>Kasa</Text>
          <Text style={styles.subtitle}>Grup harcamalarını kolayca takip et</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Şifre"
            placeholder="Şifrenizi girin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Button
            title="Giriş Yap"
            onPress={handleLogin}
            style={styles.loginButton}
          />
          
          <TouchableOpacity
            onPress={() => router.push('/register')}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountText}>
              Hesabın yok mu? <Text style={styles.createAccountLink}>Hesap Oluştur</Text>
            </Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  createAccountButton: {
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 14,
    color: '#6B7280',
  },
  createAccountLink: {
    color: '#10B981',
    fontWeight: '600',
  },
});