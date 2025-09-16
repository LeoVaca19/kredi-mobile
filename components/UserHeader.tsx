import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface UserHeaderProps {
  showDisconnect?: boolean;
  title?: string;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ showDisconnect = false, title }) => {
  const { getUserData, clearUserData, isConnected } = useUser();
  const userData = getUserData();

  const handleDisconnect = () => {
    clearUserData();
    router.replace('/');
  };

  if (!isConnected || !userData) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>connected: {userData.shortAddress}</Text>
        </View>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      
      {showDisconnect && (
        <Pressable style={styles.disconnectButton} onPress={handleDisconnect}>
          <Ionicons name="log-out-outline" size={20} color="#6B6864" />
          <Text style={styles.disconnectText}>Disconnect</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 104, 100, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#50E3C2',
  },
  statusText: {
    fontSize: 12,
    color: '#6B6864',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
    marginTop: 4,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(107, 104, 100, 0.1)',
  },
  disconnectText: {
    fontSize: 12,
    color: '#6B6864',
    fontWeight: '500',
  },
});
