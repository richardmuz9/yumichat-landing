// screens/PremiumFeaturesScreen.tsx

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
  Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OpenRouterService } from '../services/OpenRouterService';
import { PaymentService } from '../services/PaymentService';

type Message = {
  text: string;
  sender: 'user' | 'yumi';
};

const PremiumFeaturesScreen = ({ navigation }) => {
  const [premium, setPremium] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'yumi' }[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string | undefined>(undefined);
  const [trialLeft, setTrialLeft] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    checkTrial();
    PaymentService.isPremium().then((isPremium) => {
      if (!isPremium) {
        // Stay here but disable premium features if not premium
        setPremium(false);
      } else {
        setPremium(true);
      }
    });
    AsyncStorage.getItem('chatHistory').then((stored) => {
      if (stored) setMessages(JSON.parse(stored));
    });
  }, []);

  const checkTrial = async () => {
    const started = await AsyncStorage.getItem('trialStart');
    if (started) {
      const start = new Date(started);
      const now = new Date();
      const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 1) {
        setTrialLeft(0);
      } else {
        setTrialLeft(1 - diff);
      }
    } else {
      await AsyncStorage.setItem('trialStart', new Date().toISOString());
      setTrialLeft(1);
    }
  };

  const handleTrialContinue = async () => {
    await AsyncStorage.setItem('isPremium', 'true');
    setPremium(true);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const saveHistory = async (newMessages) => {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    const userEntry: Message = { text: userMessage, sender: 'user' as const };
    const updated1 = [...messages, userEntry];
    setMessages(updated1);
    setUserMessage('');
    const yumiReply = await OpenRouterService.sendMessage(userMessage, selectedUniversity);
    const yumiEntry: Message = { text: yumiReply, sender: 'yumi' as const };
    const updated2 = [...updated1, yumiEntry];
    setMessages(updated2);
    saveHistory(updated2);
  };

  const handleWebSearch = () => {
    if (!selectedUniversity) {
      Alert.alert('大学を選択してください');
      return;
    }
    const query = encodeURIComponent(`${selectedUniversity} 公式サイト`);
    WebBrowser.openBrowserAsync(`https://www.google.com/search?q=${query}`);
  };

  const handleUploadScript = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
    if (res.canceled === false && res.assets && res.assets.length > 0) {
      const feedback = await OpenRouterService.sendMessage(`Please analyze this interview script: ${res.assets[0].uri}`);
      Alert.alert('Yumiのフィードバック', feedback);
    }
  };

  const handleTextbookRecs = async () => {
    Alert.prompt('テキストブックのトピック', '例: 日本語文法', async (topic) => {
      if (topic) {
        const prompt = `Recommend 3 Japanese‐language textbooks for learning ${topic}. Include title, author, price range.`;
        const recs = await OpenRouterService.sendMessage(prompt);
        setMessages((prev) => [...prev, { text: `📚 Recommendations for ${topic}:\n${recs}`, sender: 'yumi' }]);
      }
    });
  };

  const handleClear = async () => {
    setMessages([]);
    await AsyncStorage.removeItem('chatHistory');
  };

  const handlePaymentConfirm = async () => {
    Alert.alert('确认已付款？', '请确保你已通过支付宝或微信支付成功', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: async () => {
          await AsyncStorage.setItem('isPremium', 'true');
          setPremium(true);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <ImageBackground source={require('../assets/bg-preminumq1.png')} style={styles.background}>
        <View style={styles.header}>
          <Text style={styles.title}>🌸 Yumi Premium Chat 🌸</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>🗑 Clear Chat</Text>
          </TouchableOpacity>
        </View>

        {trialLeft !== null && trialLeft > 0 && !premium && (
          <TouchableOpacity onPress={handleTrialContinue} style={styles.trialButton}>
            <Text style={styles.trialText}>⏳ 试用剩余 {trialLeft} 天，点击继续体验</Text>
          </TouchableOpacity>
        )}

        {!premium && (
          <View style={styles.qrContainer}>
            <Text style={styles.memberText}>💰 会员价格：¥50 / 3个月</Text>
            <Text style={styles.memberText}>📱 支持支付宝 & 微信扫码支付</Text>
            <Text style={styles.label}>支付宝</Text>
            <Image source={require('../assets/alipay.png')} style={styles.qr} />
            <Text style={styles.label}>微信</Text>
            <Image source={require('../assets/wechat.png')} style={styles.qr} />
            <TouchableOpacity onPress={handlePaymentConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>✅ 我已完成支付</Text>
            </TouchableOpacity>
          </View>
        )}

        {premium && (
          <>
            <View style={styles.universityPicker}>
              <Text>Target University:</Text>
              <TextInput
                style={styles.uniInput}
                placeholder="e.g. Meiji University"
                value={selectedUniversity}
                onChangeText={setSelectedUniversity}
              />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer} keyboardShouldPersistTaps="handled">
              {messages.map((msg, idx) => (
                <View key={idx} style={msg.sender === 'user' ? styles.userMessage : styles.yumiMessage}>
                  {msg.sender === 'yumi' ? (
                    <View style={styles.yumiRow}>
                      <Image source={require('../assets/yumi-avatar.png')} style={styles.yumiIcon} />
                      <Text style={styles.messageText}>{msg.text}</Text>
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
                placeholder="Ask Yumi..."
                multiline
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.premiumActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleWebSearch}>
                <Text>🔍 Search Uni Website</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleUploadScript}>
                <Text>📄 Upload Interview Script</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleTextbookRecs}>
                <Text>📚 Textbook Recs</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  clearText: { color: '#f66' },
  universityPicker: { marginVertical: 8 },
  uniInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 4 },
  messagesContainer: { paddingBottom: 10 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#d1ecf1', borderRadius: 10, padding: 10, marginBottom: 8, maxWidth: '75%' },
  yumiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff3cd', borderRadius: 10, padding: 10, marginBottom: 8, maxWidth: '75%' },
  messageText: { fontSize: 15, lineHeight: 20 },
  yumiRow: { flexDirection: 'row', alignItems: 'flex-start' },
  yumiIcon: { width: 30, height: 30, marginRight: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fefefe', padding: 8 },
  input: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc' },
  sendButton: { backgroundColor: '#ff69b4', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginLeft: 8 },
  sendText: { color: '#fff', fontWeight: 'bold' },
  premiumActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  actionButton: { backgroundColor: '#eee', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  label: { fontSize: 14, marginTop: 12 },
  qr: { width: 200, height: 200, marginTop: 4, resizeMode: 'contain' },
  confirmButton: { backgroundColor: '#28a745', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, marginTop: 20 },
  confirmText: { color: '#fff', fontWeight: 'bold' },
  trialButton: { backgroundColor: '#fce4ec', padding: 10, borderRadius: 10, marginTop: 10 },
  trialText: { color: '#c2185b' },
  memberText: { fontSize: 14, color: '#d6336c' }
});

export default PremiumFeaturesScreen;
