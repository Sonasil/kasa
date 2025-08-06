import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  sender: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
}

export function ChatMessage({ sender, message, timestamp, isSystem = false }: ChatMessageProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[styles.container, isSystem && styles.systemContainer]}>
      <View style={[styles.bubble, isSystem && styles.systemBubble]}>
        {!isSystem && (
          <Text style={styles.sender}>{sender}</Text>
        )}
        <Text style={[styles.message, isSystem && styles.systemMessage]}>
          {message}
        </Text>
        <Text style={[styles.timestamp, isSystem && styles.systemTimestamp]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  systemContainer: {
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
  },
  systemBubble: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  systemMessage: {
    fontSize: 13,
    color: '#6366F1',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  systemTimestamp: {
    fontSize: 11,
    color: '#A5B4FC',
  },
});