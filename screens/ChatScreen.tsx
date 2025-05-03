import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenRouterService } from '../services/OpenRouterService';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('chatHistory');
      if (stored) setMessages(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      const userEntry = { text: userMessage, sender: 'user' };
      const updated = [...messages, userEntry];
      setMessages(updated);
      setUserMessage('');

      try {
        const yumiReply = await OpenRouterService.sendMessage(userMessage);
        const yumiEntry = {
          text: typeof yumiReply === 'string' ? yumiReply : '[Yumiの返答が無効です]',
          sender: 'yumi',
        };
        const finalMessages = [...updated, yumiEntry];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } catch (err) {
        console.error('🛑 Yumi error:', err);
        const yumiEntry = { text: '[Yumiは応答に失敗しました]', sender: 'yumi' };
        const finalMessages = [...updated, yumiEntry];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    await AsyncStorage.removeItem('chatHistory');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        source={require('../assets/bg-study-japan.png')}
        style={styles.background}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={msg.sender === 'user' ? styles.userMessage : styles.yumiMessage}>
              {msg.sender === 'yumi' ? (
                <View style={styles.yumiRow}>
                  <Image
                    source={require('../assets/yumi-avatar.png')}
                    style={styles.yumiIcon}
                  />
                  <View style={styles.bubbleTextWrapper}>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.messageText}>{msg.text}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userMessage}
            onChangeText={setUserMessage}
            placeholder="和Yumi聊聊留学、生活或心事吧～"
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyButtons}>
          <TouchableOpacity onPress={handleClearChat} style={styles.buttonBox}>
            <Text style={styles.historyText}>📚 Start New Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={loadChatHistory} style={styles.buttonBox}>
            <Text style={styles.historyText}>📖 Chat History</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 10 },
  messagesContainer: { paddingBottom: 10 },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1ecf1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  yumiMessage: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    maxWidth: '100%',
  },
  yumiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },
  yumiIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 15,
  },
  bubbleTextWrapper: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
    flexShrink: 1,
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fefefe',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: { color: 'white', fontWeight: 'bold' },
  historyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  historyText: { fontSize: 14, color: '#007BFF' },
  buttonBox: { paddingHorizontal: 10 },
});

export default ChatScreen;
