import React, { useState, useEffect, useRef, useContext } from 'react';
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
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import VPNHelpModal from '../components/VPNHelpModal';
import OfficeHelperModal from '../components/OfficeHelperModal';
import { LanguageContext } from '../components/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  PremiumFeatures: undefined;
  Archive: undefined;
  ChatHistoryModal: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PremiumFeatures'>;

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [officeModalVisible, setOfficeModalVisible] = useState(false);
  const [showVPNHelp, setShowVPNHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation<NavigationProp>();
  const { t } = useContext(LanguageContext);
  const MAX_FREE_OFFICE_USES = 5;
const getTodayKey = () => `office_helper_usage_${new Date().toISOString().slice(0, 10)}`;

const checkOfficeHelperLimit = async (): Promise<boolean> => {
  const key = getTodayKey();
  const usage = parseInt((await AsyncStorage.getItem(key)) || '0');
  return usage < MAX_FREE_OFFICE_USES;
};

const incrementOfficeHelperUsage = async () => {
  const key = getTodayKey();
  const usage = parseInt((await AsyncStorage.getItem(key)) || '0');
  await AsyncStorage.setItem(key, (usage + 1).toString());
};

const handleFreeOfficeHelper = async () => {
  const allowed = await checkOfficeHelperLimit();

  if (!allowed) {
    Alert.alert("🔒 Limit Reached", "You've used all 5 daily free tasks. Upgrade to Premium for unlimited access!");
    return;
  }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
    });

    if (!result.canceled) {
      await incrementOfficeHelperUsage();

      const fileName = result.assets[0].name;
      const messagePrompt = `📝 A user uploaded ${fileName}. Please provide helpful insights, summaries, or automation steps based on the file content.`;

      const yumiReply = await OpenRouterService.sendMessage(messagePrompt, 'qwen:7b-chat');

      const userEntry = { text: `📎 Sent ${fileName} to Office Helper`, sender: 'user' };
      const yumiEntry = {
        text: typeof yumiReply === 'string' ? yumiReply : '[Office Helper reply failed]',
        sender: 'yumi',
      };

      const updated = [...messages, userEntry, yumiEntry];
      setMessages(updated);
      saveChatHistory(updated);
    }
  } catch (err) {
    console.error('📎 OfficeHelper error:', err);
    Alert.alert("❌ File upload failed", "There was an issue processing your file.");
  }
};

  useEffect(() => {
    loadChatHistory();
    checkPremiumStatus();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const checkPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      setIsPremium(premiumStatus === 'true');
    } catch (e) {
      console.error('Failed to load premium status:', e);
    }
  };

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

  const handleUnlockPremium = () => {
    navigation.navigate('PremiumFeatures');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ImageBackground source={require('../assets/yumi-icon1.png')} style={styles.background}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={msg.sender === 'user' ? styles.userMessage : styles.yumiMessage}>
              {msg.sender === 'yumi' ? (
                <View style={styles.yumiRow}>
                  <Image source={require('../assets/yumi-avatar.png')} style={styles.yumiIcon} />
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
            placeholder={t('chatPlaceholder')}
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>{t('send')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyButtons}>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.buttonBox}>
            <Text style={styles.historyText}>⚙️ {t('settings')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOfficeModalVisible(true)} style={styles.buttonBox}>
            <Text style={styles.historyText}>📎 {t('officeHelper')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowVPNHelp(true)} style={styles.buttonBox}>
            <Text style={styles.historyText}>🌐 {t('vpnHelp')}</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <ScrollView style={{ maxHeight: 400 }}>
              {messages.map((msg, idx) => (
                <Text key={idx} style={{ marginBottom: 5 }}>
                  [{msg.sender}]: {msg.text}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.sendButton}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <OfficeHelperModal
          visible={officeModalVisible}
          onClose={() => setOfficeModalVisible(false)}
          isPremium={isPremium}
          setMessages={setMessages}
        />

        <VPNHelpModal
          visible={showVPNHelp}
          onClose={() => setShowVPNHelp(false)}
        />

        <Modal isVisible={showSettings} onBackdropPress={() => setShowSettings(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chat Settings</Text>
            <TouchableOpacity onPress={handleClearChat} style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>📚 Start New Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setShowSettings(false);
              navigation.navigate('ChatHistoryModal');
            }} style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>📖 Chat History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setShowSettings(false);
              navigation.navigate('Archive');
            }} style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>📘 我的 Archive</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={[styles.settingsButton, styles.closeButton]}>
              <Text style={styles.settingsButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  buttonBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  closeButton: {
    backgroundColor: '#ff69b4',
    marginTop: 10,
  },
});

export default ChatScreen;