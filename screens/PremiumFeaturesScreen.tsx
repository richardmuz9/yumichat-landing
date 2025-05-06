// screens/PremiumFeaturesScreen.tsx

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
  Alert,
  Animated,
  Easing,
  Modal
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { OpenRouterService } from '../services/OpenRouterService';
import VPNHelpModal from '../components/VPNHelpModal';
import OfficeHelperModal from '../components/OfficeHelperModal';
import { LanguageContext } from '../components/LanguageContext';
import { PaymentManager } from '../components/PaymentManager';

type RootStackParamList = {
  Chat: undefined;
  PremiumFeatures: undefined;
  Archive: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

type Message = {
  text: string;
  sender: 'user' | 'yumi';
};

const PremiumFeaturesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useContext(LanguageContext);
  const [premium, setPremium] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const unlockAnimation = new Animated.Value(0);
  const [showVPNHelp, setShowVPNHelp] = useState(false);
  const [officeModalVisible, setOfficeModalVisible] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [trialActive, setTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'alipay' | 'wechat' | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    AsyncStorage.getItem('chatHistory').then((stored) => {
      if (stored) setMessages(JSON.parse(stored));
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkAccess = async () => {
        const dev = await AsyncStorage.getItem('isDeveloper');
        setIsDeveloper(dev === 'true');
        const premiumStatus = await AsyncStorage.getItem('isPremium');
        const premiumExpires = await AsyncStorage.getItem('premiumExpires');
        if (dev === 'true') {
          setPremium(true);
          setIsUnlocked(true);
          setShowPaywall(false);
          return;
        }
        if (premiumStatus === 'true' && premiumExpires) {
          const now = new Date();
          const expires = new Date(premiumExpires);
          if (expires > now) {
            setPremium(true);
            setIsUnlocked(true);
            setShowPaywall(false);
            return;
          }
        }
        setPremium(false);
        setIsUnlocked(false);
        setShowPaywall(true);
      };
      checkAccess();
    }, [])
  );

  const checkPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      const trialStart = await AsyncStorage.getItem('trialStart');
      if (premiumStatus === 'true') {
        setPremium(true);
        setIsUnlocked(true);
        startUnlockAnimation();
      } else if (trialStart) {
        const start = new Date(trialStart);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 3) {
          setTrialActive(true);
          setTrialDaysLeft(3 - diff);
        } else {
          setShowPaywall(true);
        }
      } else {
        // Start trial
        await AsyncStorage.setItem('trialStart', new Date().toISOString());
        setTrialActive(true);
        setTrialDaysLeft(3);
      }
    } catch (e) {
      console.error('Failed to check premium status:', e);
    }
  };

  const startUnlockAnimation = () => {
    Animated.sequence([
      Animated.timing(unlockAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ]).start();
  };

  const saveHistory = async (newMessages: Message[]) => {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    const userEntry: Message = { text: userMessage, sender: 'user' };
    const updated1 = [...messages, userEntry];
    setMessages(updated1);
    setUserMessage('');
    const yumiReply = await OpenRouterService.sendMessage(userMessage);
    const yumiEntry: Message = { text: yumiReply, sender: 'yumi' };
    const updated2 = [...updated1, yumiEntry];
    setMessages(updated2);
    saveHistory(updated2);
  };
  const handlePremiumOfficeHelper = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ],
      });
  
      if (!result.canceled) {
        const fileName = result.assets[0].name;
  
        const prompt = `📂 Premium user uploaded ${fileName}. Please analyze this document and provide automatic assistance or suggestions in detail.`;
  
        const yumiReply = await OpenRouterService.sendMessage(prompt, 'gpt-4o');
  
        const userEntry: Message = { text: `📎 Sent ${fileName} to Office Helper`, sender: 'user' };
        const yumiEntry: Message = { text: yumiReply, sender: 'yumi' };
  
        const updated = [...messages, userEntry, yumiEntry];
        setMessages(updated);
        saveHistory(updated);
      }
    } catch (err) {
      console.error("Premium Office Helper Error:", err);
      Alert.alert("❌ 出错了", "无法上传或处理文件。");
    }
  };  

  const handleTakedaJuku = () => {
    WebBrowser.openBrowserAsync('https://www.takeda.tv/');
  };

  const handleStudyPlan = async () => {
    if (!selectedLevel) {
      Alert.alert(t('selectTargetUniversityLevel'));
      return;
    }
    const prompt = `请为我制定一个EJU考试的学习计划，包含日语、数学、理科或综合科目，适合${selectedLevel}目标（如MARCH、旧帝大、东京大学）。`;
    const reply = await OpenRouterService.sendMessage(prompt);
    setMessages((prev) => [...prev, { text: `🧠 学习计划:\n${reply}`, sender: 'yumi' }]);
  };

  const handleRoute = async () => {
    if (!selectedLevel) {
      Alert.alert(t('selectTargetUniversityLevel'));
      return;
    }
    const prompt = `请提供一个从基础到高难度的学习路线，帮助考取${selectedLevel}，包括推荐的教材、时间安排和每日任务建议。`;
    const reply = await OpenRouterService.sendMessage(prompt);
    setMessages((prev) => [...prev, { text: `📈 学习路线:\n${reply}`, sender: 'yumi' }]);
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    if (!selectedPaymentMethod) {
      setPaymentModalVisible(true);
      return;
    }
    // Instead of processing payment, show QR code modal
    setShowQRCodeModal(true);
  };

  const handleConfirmPaid = async () => {
    setIsProcessing(true);
    try {
      // Directly unlock premium since payment is manual
      setIsUnlocked(true);
      await AsyncStorage.setItem('isPremium', 'true');
      startUnlockAnimation();
      Alert.alert(t('premiumUnlocked'), t('thankYouForPayment') || 'Thank you for your payment!');
    } catch (error) {
      Alert.alert(t('error'), t('paymentErrorOccurred'));
    } finally {
      setIsProcessing(false);
      setShowQRCodeModal(false);
      setSelectedPaymentMethod(null);
      setPaymentModalVisible(false);
    }
  };

  const scale = unlockAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = unlockAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  if (showPaywall && !premium && !trialActive && !isDeveloper) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>{t('premiumStudyCenter')}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>{t('premiumPaywallText')}</Text>
        <TouchableOpacity onPress={handlePayment} style={{ backgroundColor: '#ff66cc', padding: 16, borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('subscribeNow')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (trialActive && !premium && !isDeveloper) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>{t('premiumStudyCenter')}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>{t('trialActiveText')}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>{t('upgradeForFullAccess')}</Text>
        <TouchableOpacity onPress={handlePayment} style={{ backgroundColor: '#ff66cc', padding: 16, borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('subscribeNow')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <ImageBackground source={require('../assets/bg-study-japan.png')} style={styles.background}>
        <Text style={styles.title}>{t('premiumStudyCenter')}</Text>

        {!premium && (
          <View style={styles.qrContainer}>
            <Text style={styles.memberText}>{t('membershipPrice')}</Text>
            <Text style={styles.memberText}>{t('supportedPaymentMethods')}</Text>
            
            <View style={styles.paymentMethodsContainer}>
              <Text style={styles.paymentMethodTitle}>{t('alipayPayment')}</Text>
              <Image source={require('../assets/alipay.png')} style={styles.qr} />
              
              <Text style={styles.paymentMethodTitle}>{t('wechatPayment')}</Text>
              <Image source={require('../assets/wechat.png')} style={styles.qr} />
              
              <Text style={styles.paymentMethodTitle}>{t('unionPayPayment')}</Text>
              <Image source={require('../assets/unionpay.png')} style={styles.qr} />
              
              <Text style={styles.paymentMethodTitle}>{t('creditCardPayment')}</Text>
              <View style={styles.creditCardContainer}>
                <Image source={require('../assets/visa.png')} style={styles.creditCardIcon} />
                <Image source={require('../assets/mastercard.png')} style={styles.creditCardIcon} />
                <Image source={require('../assets/amex.png')} style={styles.creditCardIcon} />
              </View>
            </View>

            <TouchableOpacity onPress={handlePayment} style={styles.confirmButton}>
              <Text style={styles.confirmText}>{t('paymentCompleted')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowVPNHelp(true)} style={styles.vpnHelpButton}>
              <Text style={styles.vpnHelpText}>{t('vpnHelp')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {premium && (
          <>
            <TextInput
              placeholder={t('targetUniversityLevelPlaceholder')}
              style={styles.uniInput}
              value={selectedLevel}
              onChangeText={setSelectedLevel}
            />

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer}>
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
                placeholder={t('askYumi')}
                multiline
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendText}>{t('send')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleTakedaJuku} style={styles.button}>
                <Text>🔗 {t('takedaJukuWebsite')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStudyPlan} style={styles.button}>
                <Text>🧠 {t('generateStudyPlan')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRoute} style={styles.button}>
                <Text>📈 {t('routeRecommendation')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOfficeModalVisible(true)} style={styles.button}>
                <Text>📎 {t('officeHelper')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowVPNHelp(true)} style={styles.vpnHelpButton}>
                <Text style={styles.vpnHelpText}>🌐 {t('vpnHelp')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Archive')} style={styles.button}>
                <Text>📘 {t('viewMyArchive')}</Text>
              </TouchableOpacity>

            </View>
          </>
        )}

        {!isUnlocked && (
          <Animated.View style={[styles.paymentContainer, { opacity }]}>
            <TouchableOpacity
              style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              <Text style={styles.paymentButtonText}>
                {isProcessing ? t('processing') : t('unlockPremium')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isUnlocked && (
          <Animated.View
            style={[
              styles.unlockContainer,
              {
                transform: [{ scale }],
                opacity: unlockAnimation,
              },
            ]}
          >
            <Text style={styles.unlockText}>{t('premiumUnlocked')}</Text>
          </Animated.View>
        )}

        <Modal
          visible={paymentModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPaymentModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', width: 300 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>{t('selectPaymentMethod') || 'Select Payment Method'}</Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                onPress={() => { setSelectedPaymentMethod('alipay'); setPaymentModalVisible(false); setShowQRCodeModal(true); }}
              >
                <Image source={require('../assets/alipay.png')} style={{ width: 32, height: 32, marginRight: 10 }} />
                <Text>Alipay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                onPress={() => { setSelectedPaymentMethod('wechat'); setPaymentModalVisible(false); setShowQRCodeModal(true); }}
              >
                <Image source={require('../assets/wechat.png')} style={{ width: 32, height: 32, marginRight: 10 }} />
                <Text>WeChat Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Text style={{ color: '#666', marginTop: 10 }}>{t('close') || 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* QR Code Modal */}
        <Modal
          visible={showQRCodeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQRCodeModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', width: 320 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                {selectedPaymentMethod === 'alipay' ? 'Scan with Alipay' : 'Scan with WeChat'}
              </Text>
              <Image
                source={selectedPaymentMethod === 'alipay' ? require('../assets/alipay.png') : require('../assets/wechat.png')}
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
              <Text style={{ marginBottom: 16 }}>Scan this QR code to pay</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 8 }}
                onPress={handleConfirmPaid}
                disabled={isProcessing}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isProcessing ? t('processing') : 'I have paid'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowQRCodeModal(false)}>
                <Text style={{ color: '#666' }}>{t('close') || 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>

      <VPNHelpModal visible={showVPNHelp} onClose={() => setShowVPNHelp(false)} />
      <OfficeHelperModal
        visible={officeModalVisible}
        onClose={() => setOfficeModalVisible(false)}
        isPremium={premium}
        setMessages={setMessages}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  uniInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 },
  messagesContainer: { paddingBottom: 10 },
  userMessage: {
    alignSelf: 'flex-end', backgroundColor: '#d1ecf1',
    borderRadius: 10, padding: 10, marginBottom: 10, maxWidth: '75%',
  },
  yumiMessage: {
    alignSelf: 'flex-start', backgroundColor: '#fff3cd',
    borderRadius: 10, padding: 10, marginBottom: 10, maxWidth: '75%',
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  yumiIcon: { width: 30, height: 30, marginRight: 5 },
  yumiRow: { flexDirection: 'row', alignItems: 'flex-start' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 8, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fefefe',
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 16, borderWidth: 1, borderColor: '#ccc', marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#ff69b4', paddingVertical: 8,
    paddingHorizontal: 16, borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginTop: 10, backgroundColor: '#f3f3f3', padding: 10, borderRadius: 10,
  },
  button: {
    padding: 10, backgroundColor: '#eee', borderRadius: 8,
  },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  memberText: { fontSize: 14, color: '#d6336c' },
  paymentMethodsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  creditCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  creditCardIcon: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
  },
  vpnHelpButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  vpnHelpText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  paymentButton: {
    backgroundColor: '#ff66cc',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unlockContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  unlockText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff66cc',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qr: { width: 200, height: 200, marginTop: 4, resizeMode: 'contain' },
});

export default PremiumFeaturesScreen;
