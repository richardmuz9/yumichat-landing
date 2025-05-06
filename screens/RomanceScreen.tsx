import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPersonalityFromNumber, getPersonalityPrompt } from '../services/RomanceService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Shop: undefined;
  Romance: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const gifts = [
  { id: '1', name: '👕 Anime T-shirt', cost: 1, affection: 3 },
  { id: '2', name: '📿 Pendant', cost: 2, affection: 5 },
  { id: '3', name: '🍰 Cake', cost: 2, affection: 6 },
  { id: '4', name: '👗 Dress', cost: 4, affection: 8 },
  { id: '5', name: '💍 Ring', cost: 5, affection: 10 },
  { id: '6', name: '🍵 Tea', cost: 1, affection: 2 },
  { id: '7', name: '☕ Coffee', cost: 1, affection: 2 },
  { id: '8', name: '📱 Phone', cost: 4, affection: 7 },
  { id: '9', name: '🌸 Flower', cost: 1, affection: 3 },
  { id: '10', name: '🍫 Snack', cost: 1, affection: 2 },
  { id: '11', name: '🧦 Socks', cost: 1, affection: 1 },
  { id: '12', name: '💎 Earrings', cost: 2, affection: 4 },
  { id: '13', name: '📔 Notes', cost: 1, affection: 2 },
  { id: '14', name: '🎁 Handmade', cost: 3, affection: 7 },
  { id: '15', name: '🏋️ Workout Gear', cost: 3, affection: 5 },
  { id: '16', name: '🎸 Instrument', cost: 3, affection: 5 },
  { id: '17', name: '🖊️ Pen', cost: 1, affection: 2 },
  { id: '18', name: '🥩 Beef', cost: 2, affection: 3 },
  { id: '19', name: '🍖 Pork', cost: 2, affection: 3 },
  { id: '20', name: '👛 Wallet', cost: 3, affection: 4 },
  { id: '21', name: '🍊 Vitamin C', cost: 1, affection: 2 },
];

const getBackgroundForAffection = (affection) => {
  if (affection >= 175) return require('../assets/yumi-hitachi.png');
  if (affection >= 150) return require('../assets/yumi-hiroshima.png');
  if (affection >= 125) return require('../assets/yumi-nagasaki.png');
  if (affection >= 100) return require('../assets/yumi-hokkaido.png');
  if (affection >= 75) return require('../assets/yumi-enoshima.png');
  if (affection >= 50) return require('../assets/yumi-cafe.png');
  if (affection >= 25) return require('../assets/yumi-library.png');
  return require('../assets/yumi-date-bg.png');
};

const RomanceScreen = () => {
  const [affection, setAffection] = useState(0);
  const [shards, setShards] = useState(5);
  const [personality, setPersonality] = useState('');
  const [showNumberPrompt, setShowNumberPrompt] = useState(true);
  const [inputNumber, setInputNumber] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      const savedAffection = await AsyncStorage.getItem('affection');
      if (savedAffection) setAffection(parseInt(savedAffection));
    })();
  }, []);

  const handleNumberConfirm = () => {
    const num = parseInt(inputNumber);
    if (isNaN(num) || num < 1 || num > 10) {
      Alert.alert('Please enter a number between 1 and 10');
      return;
    }
    const selected = getPersonalityFromNumber(num);
    setPersonality(selected);
    setShowNumberPrompt(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    Alert.alert(`Yumi (${selected})`, `"E-eh? I'm your ${selected} today... be gentle with me, okay?"`);
  };

  const giveGift = async (gift) => {
    if (shards >= gift.cost) {
      const newAffection = affection + gift.affection;
      setAffection(newAffection);
      setShards((prev) => prev - gift.cost);
      await AsyncStorage.setItem('affection', newAffection.toString());

      const randomReply = `Yumi (${personality}): \"${gift.name}? ${getRandomResponse()}\"`;
      Alert.alert(randomReply);

      if (newAffection === 175) {
        Alert.alert('🌸 Yumi Confession!', 'Yumi confesses to you in Hitachi Seaside Park. She smiles gently. 💖');
      }
    } else {
      alert('Not enough Shards of Time!');
    }
  };

  const getRandomResponse = () => {
    const replies = [
      'T-this is... really nice of you!',
      'W-wow... You always surprise me.',
      'I-I don\'t deserve this much kindness... baka!',
      'Thank you! I\'ll treasure it forever!',
      'Oh? You\'re spoiling me now~',
      'W-What are you trying to make me feel?!',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  return (
    <ImageBackground source={getBackgroundForAffection(affection)} style={styles.background}>
      {showNumberPrompt ? (
        <View style={styles.numberBox}>
          <Text style={styles.modalTitle}>💫 Enter a number (1–10) to choose Yumi's personality!</Text>
          <TextInput
            value={inputNumber}
            onChangeText={setInputNumber}
            keyboardType="numeric"
            placeholder="1 to 10"
            style={styles.input}
          />
          <TouchableOpacity style={styles.chargeButton} onPress={handleNumberConfirm}>
            <Text style={styles.chargeText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Text style={styles.title}>💞 Date with Yumi</Text>

          <View style={styles.statusBar}>
            <Text style={styles.status}>❤️ Affection: {affection}</Text>
            <Text style={styles.status}>⏳ Shards: {shards}</Text>
          </View>

          <Text style={styles.subtitle}>Choose a gift to give Yumi:</Text>
          <FlatList
            data={gifts}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.giftList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.giftItem} onPress={() => giveGift(item)}>
                <Text style={styles.giftText}>{item.name}</Text>
                <Text style={styles.cost}>-{item.cost}⏳</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity 
            style={styles.chargeButton} 
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.chargeText}>💳 Charge Shards</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

export default RomanceScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ff66aa',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  giftList: {
    marginVertical: 10,
  },
  giftItem: {
    backgroundColor: '#fff0f7',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  giftText: {
    fontSize: 16,
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  cost: {
    fontSize: 12,
    color: '#999',
  },
  chargeButton: {
    backgroundColor: '#ff66aa',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  chargeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberBox: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff69b4',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    textAlign: 'center',
  },
});
