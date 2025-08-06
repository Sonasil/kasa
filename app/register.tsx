import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Mock registration - navigate to tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Hesap Oluştur" showBack />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Kasa'ya katıl ve arkadaşlarınla harcamaları paylaş</Text>
        
        <View style={styles.form}>
          <Input
            label="Ad Soyad"
            placeholder="Adınızı ve soyadınızı girin"
            value={name}
            onChangeText={setName}
          />
          
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
            placeholder="Bir şifre oluşturun"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Button
            title="Hesap Oluştur"
            onPress={handleRegister}
            style={styles.registerButton}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: 8,
  },
});