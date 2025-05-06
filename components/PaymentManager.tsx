import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';

type RootStackParamList = {
  Shop: undefined;
  PremiumFeatures: undefined;
  Romance: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PaymentMethod = 'alipay' | 'wechat' | 'unionpay';

interface PaymentDetails {
  amount: number;
  type: 'premium' | 'shards';
  method: PaymentMethod;
}

export const PaymentManager = {
  async checkPremiumStatus(): Promise<boolean> {
    try {
      const isPremium = await AsyncStorage.getItem('isPremium');
      return isPremium === 'true';
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  },

  async getShardsBalance(): Promise<number> {
    try {
      const shards = await AsyncStorage.getItem('shards');
      return parseInt(shards || '0');
    } catch (error) {
      console.error('Failed to get shards balance:', error);
      return 0;
    }
  }
};

export const PaymentButton = ({ 
  amount, 
  type, 
  onSuccess, 
  onError 
}: { 
  amount: number; 
  type: 'premium' | 'shards';
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handlePayment = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowPaymentMethods(false);
    setShowQRCodeModal(true);
  };

  const handleConfirmPaid = async () => {
    setLoading(true);
    try {
      if (type === 'premium') {
        // Set premium with 30-day expiration
        const now = new Date();
        const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await AsyncStorage.setItem('isPremium', 'true');
        await AsyncStorage.setItem('premiumStartDate', now.toISOString());
        await AsyncStorage.setItem('premiumExpires', expires.toISOString());
        Alert.alert('Success', 'Premium features unlocked for 30 days!');
        onSuccess?.();
        navigation.navigate('PremiumFeatures');
      } else {
        const currentShards = await AsyncStorage.getItem('shards');
        const newShards = (parseInt(currentShards || '0') + amount).toString();
        await AsyncStorage.setItem('shards', newShards);
        Alert.alert('Success', `${amount} shards added!`);
        onSuccess?.();
        navigation.navigate('Romance');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      onError?.();
    } finally {
      setLoading(false);
      setShowQRCodeModal(false);
      setSelectedPaymentMethod(null);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => setShowPaymentMethods(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {type === 'premium' ? 'Unlock Premium' : `Buy ${amount} Shards`}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showPaymentMethods}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentMethods(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <TouchableOpacity
              style={styles.paymentMethod}
              onPress={() => handlePayment('alipay')}
            >
              <Image source={require('../assets/alipay.png')} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>Alipay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentMethod}
              onPress={() => handlePayment('wechat')}
            >
              <Image source={require('../assets/wechat.png')} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>WeChat Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentMethod}
              onPress={() => handlePayment('unionpay')}
            >
              <Image source={require('../assets/unionpay.png')} style={styles.paymentIcon} />
              <Text style={styles.paymentText}>Union Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPaymentMethods(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showQRCodeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRCodeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPaymentMethod === 'alipay' ? 'Scan with Alipay' : selectedPaymentMethod === 'wechat' ? 'Scan with WeChat' : 'Scan with Union Pay'}
            </Text>
            <Image
              source={
                selectedPaymentMethod === 'alipay'
                  ? require('../assets/alipay.png')
                  : selectedPaymentMethod === 'wechat'
                  ? require('../assets/wechat.png')
                  : require('../assets/unionpay.png')
              }
              style={{ width: 200, height: 200, marginBottom: 16 }}
            />
            <Text style={{ marginBottom: 16 }}>Scan this QR code to pay</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 8 }}
              onPress={handleConfirmPaid}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? 'Processing...' : 'I have paid'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowQRCodeModal(false)}>
              <Text style={{ color: '#666' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff66cc',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff66cc',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
}); 