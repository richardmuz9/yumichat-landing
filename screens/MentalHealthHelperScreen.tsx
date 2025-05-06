import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getYumiMentalHealthReply } from '../services/MentalHealthService';
import { LanguageContext } from '../components/LanguageContext';

type Message = {
  sender: 'user' | 'yumi';
  text: string;
};

type Mode = 'mental' | 'study' | 'office';

const MentalHealthHelperScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'yumi', text: "Hi... I'm Yumi. If you're feeling down or anxious, I'm here for you. 💗" },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('mental');
  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useContext(LanguageContext);

  const toggleMode = () => {
    const nextMode: Mode = mode === 'mental' ? 'study' : mode === 'study' ? 'office' : 'mental';
    setMode(nextMode);
    const greeting = {
      mental: "Switched to 🌸 Mental Health Mode. I'm here to listen and support you!",
      study: "Switched to 📘 Study Advisor Mode. Let's focus and tackle your academic goals!",
      office: "Switched to 🧾 Office Helper Mode. I can help with reports, emails, and documents!",
    };
    setMessages([{ sender: 'yumi', text: greeting[nextMode] }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const yumiReply = await getYumiMentalHealthReply(messages, input, mode);
    setMessages((prev) => [...prev, { sender: 'yumi', text: yumiReply }]);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <ImageBackground
      source={require('../assets/yumi-bg.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.modeToggle}>
          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {t('mode')}: {mode === 'mental' ? t('mentalHealth') : mode === 'study' ? t('studyAdvisor') : t('officeHelper')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chat}>
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.message, msg.sender === 'user' ? styles.user : styles.yumi]}>
              <Text style={styles.text}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder={t('talkToYumi')}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>{t('send')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default MentalHealthHelperScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chat: {
    flexGrow: 1,
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '80%',
  },
  yumi: {
    backgroundColor: '#ffe4ec',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#cce5ff',
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffffcc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#f48fb1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modeToggle: {
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  toggleButton: {
    backgroundColor: '#ffb6c1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
