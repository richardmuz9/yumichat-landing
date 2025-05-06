import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../components/LanguageContext';

const ChatHistoryModal = () => {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('chatHistory');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleClear = async () => {
    try {
      await AsyncStorage.removeItem('chatHistory');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg-chat-history.png')} // Add your anime background image
      style={styles.background}
    >
      <View style={styles.header}>
        <Text style={styles.title}>📖 {t('chatHistory')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>{t('close')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.historyContainer}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>{t('noChatHistory')}</Text>
        ) : (
          history.map((msg, idx) => (
            <View
              key={idx}
              style={msg.sender === 'user' ? styles.userMsg : styles.yumiMsg}
            >
              {msg.sender === 'yumi' && (
                <Image
                  source={require('../assets/yumi-avatar1.png')}
                  style={styles.avatar}
                />
              )}
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
        <Text style={styles.clearText}>🗑 {t('clearAll')}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  closeButton: {
    fontSize: 18,
    color: '#999',
  },
  historyContainer: {
    paddingBottom: 20,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1ecf1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  yumiMsg: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 24,
    height: 24,
    marginRight: 5,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  clearBtn: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#ffb6c1',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatHistoryModal;
