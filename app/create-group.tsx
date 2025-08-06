import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    // Mock creation - go back to groups
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Grup Oluştur" showBack />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Yeni bir grup oluştur ve harcamaları paylaşmaya başla</Text>
        
        <View style={styles.form}>
          <Input
            label="Grup Adı"
            placeholder="örn. Hafta Sonu Gezisi, Ev Arkadaşları"
            value={groupName}
            onChangeText={setGroupName}
          />
          
          <Input
            label="Açıklama (İsteğe bağlı)"
            placeholder="Bu grup ne için?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.descriptionInput}
          />
          
          <Button
            title="Grup Oluştur"
            onPress={handleCreate}
            style={styles.createButton}
            disabled={!groupName.trim()}
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
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    marginTop: 24,
  },
});