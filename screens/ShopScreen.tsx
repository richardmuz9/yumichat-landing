import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentManager, PaymentButton } from '../components/PaymentManager';
import { LanguageContext } from '../components/LanguageContext';
import { useContext } from 'react';

type RootStackParamList = {
  PremiumFeatures: undefined;
  Romance: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const shardTiers = [
  { label: '$1', shards: 5 },
  { label: '$5', shards: 30 },
  { label: '$10', shards: 70 },
  { label: '$30', shards: 250 },
  { label: '$50', shards: 500 },
  { label: '$100', shards: 1200 },
];

const premiumTiers = [
  { label: '$15/month', amount: 15, description: 'Unlock all premium features for 30 days!' }
];

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useContext(LanguageContext);
  const [isPremium, setIsPremium] = useState(false);
  const [shards, setShards] = useState(0);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const premium = await PaymentManager.checkPremiumStatus();
    const shardBalance = await PaymentManager.getShardsBalance();
    setIsPremium(premium);
    setShards(shardBalance);
  };

  return (
    <ImageBackground
      source={require('../assets/yumi-charge-bg.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🛍️ {t('shop')}</Text>

        {/* Premium Plan Section */}
        {!isPremium && (
          <View style={{ backgroundColor: '#fffbe6', borderColor: '#ffd700', borderWidth: 2, borderRadius: 12, marginBottom: 20, padding: 16, alignItems: 'center' }}> 
            <Text style={{ color: '#d4af37', fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>🌟 Premium Plan</Text>
            <Text style={{ color: '#b8860b', fontWeight: 'bold', marginBottom: 8 }}>{premiumTiers[0].description}</Text>
            <PaymentButton
              amount={premiumTiers[0].amount}
              type="premium"
              onSuccess={checkStatus}
            />
            <Text style={{ color: '#888', marginTop: 8, fontSize: 16 }}>
              {premiumTiers[0].label}
            </Text>
          </View>
        )}

        {/* Shards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ {t('shardsOfTime')}</Text>
          <Text style={styles.description}>{t('shardsDescription')}</Text>
          <Text style={styles.balance}>Current Balance: {shards} ⏳</Text>

          {shardTiers.map((tier, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tierButton}
            >
              <PaymentButton
                amount={tier.shards}
                type="shards"
                onSuccess={checkStatus}
              />
              <Text style={styles.tierText}>{tier.label} → +{tier.shards} ⏳</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff66aa',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 12,
  },
  section: {
    backgroundColor: '#ffffffcc',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff66aa',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff66aa',
    marginBottom: 15,
  },
  tierButton: {
    marginBottom: 10,
  },
  tierText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});
