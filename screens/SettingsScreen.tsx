import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { LanguageContext } from '../components/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  MoodJournal: undefined;
  MentalHealthHelper: undefined;
  PremiumFeatures: undefined;
  Chat: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const [language, setLanguage] = useState('English');
  const [mood, setMood] = useState('Dere');
  const { t } = useContext(LanguageContext);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem('language');
      const savedMood = await AsyncStorage.getItem('mood');
      if (savedLang) setLanguage(savedLang);
      if (savedMood) setMood(savedMood);
    })();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('mood', mood);
      alert(t('settingsSaved'));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/yumi-bg123.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('PremiumFeatures')} style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>🔓 {t('unlockPremium')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚙️ {t('settings')}</Text>

        <Text style={styles.label}>{t('language')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            <Picker.Item label={t('english')} value="English" />
            <Picker.Item label={t('japanese')} value="日本語" />
            <Picker.Item label={t('chinese')} value="中文" />
            <Picker.Item label={t('korean')} value="한국어" />
          </Picker>
        </View>

        <Text style={styles.label}>{t('mood')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={mood}
            onValueChange={(itemValue) => setMood(itemValue)}
          >
            <Picker.Item label={t('dere')} value="Dere" />
            <Picker.Item label={t('tsun')} value="Tsun" />
          </Picker>
        </View>

        <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
          <Text style={styles.saveText}>💾 {t('saveSettings')}</Text>
        </TouchableOpacity>

        <View style={styles.featureButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MoodJournal')}
            style={[styles.featureButton, { backgroundColor: '#ffb6c1' }]}
          >
            <Text style={styles.featureButtonText}>📔 {t('moodJournal')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('MentalHealthHelper')}
            style={[styles.featureButton, { backgroundColor: '#98fb98' }]}
          >
            <Text style={styles.featureButtonText}>💝 {t('mentalHealth')}</Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 60,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff66aa',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#ffffffcc',
    padding: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    backgroundColor: '#ffffffaa',
    padding: 6,
    borderRadius: 10,
  },
  pickerWrapper: {
    backgroundColor: '#fff0f7',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#ff69b4',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: '#f48fb1',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c2185b',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureButtons: {
    marginTop: 20,
    gap: 10,
  },
  featureButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  featureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#ff66aa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c2185b',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 10,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
