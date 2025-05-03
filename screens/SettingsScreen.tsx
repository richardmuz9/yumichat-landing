import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen({ navigation }) {
  const [language, setLanguage] = useState('English');
  const [mood, setMood] = useState('Dere');

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
      alert('Settings saved!');
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>🌐 Language</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="日本語" value="日本語" />
          <Picker.Item label="中文" value="中文" />
          <Picker.Item label="한국어" value="한국어" />
        </Picker>
      </View>

      <Text style={styles.label}>🧠 Mood</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={mood}
          onValueChange={(itemValue) => setMood(itemValue)}
        >
          <Picker.Item label="Dere (sweet)" value="Dere" />
          <Picker.Item label="Tsun (teasing)" value="Tsun" />
        </Picker>
      </View>

      <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
        <Text style={styles.saveText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 10,
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
});
