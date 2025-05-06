import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../components/LanguageContext';

type MoodEntry = {
  mood: string;
  note: string;
  date: string;
};

const moodOptions = [
  '😊 Happy',
  '😢 Sad',
  '😣 Stressed',
  '😴 Tired',
  '😡 Angry',
  '😰 Anxious',
  '😍 Loved',
  '😔 Disappointed',
];

const getYumiMoodComment = (mood: string): string => {
  if (mood.includes('Happy')) return "Yay~ I'm so glad you're smiling today! 🌸";
  if (mood.includes('Sad')) return "I'm here... you can cry a little. I'll stay right beside you. 💕";
  if (mood.includes('Stressed')) return "Let's take a deep breath together... you're doing great. 💗";
  if (mood.includes('Tired')) return "You worked hard, right? Get some rest, okay~ 😴";
  if (mood.includes('Angry')) return "It's okay to feel upset. Want to talk about it a little? 💢";
  if (mood.includes('Anxious')) return "Everything will be alright... I'm here with you now. 🫂";
  if (mood.includes('Loved')) return "Aww~ That's so sweet! I'm happy your heart is warm today! 💞";
  if (mood.includes('Disappointed')) return "Things didn't go your way? Let's figure it out together. 🍀";
  return "I'm here whenever you need me!";
};

const MoodJournalScreen = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [entry, setEntry] = useState('');
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('moodJournal');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load mood history:', error);
    }
  };

  const saveEntry = async () => {
    if (!selectedMood) {
      alert(t('pleaseSelectMood'));
      return;
    }

    try {
      const newEntry: MoodEntry = {
        mood: selectedMood,
        note: entry,
        date: new Date().toLocaleString(),
      };
      const updated = [newEntry, ...history];
      await AsyncStorage.setItem('moodJournal', JSON.stringify(updated));
      setHistory(updated);
      setSelectedMood('');
      setEntry('');
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      alert(t('saveFailed'));
    }
  };

  return (
    <ImageBackground
      source={require('../assets/yumi-bg1234.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 {t('moodJournal')}</Text>

        <Text style={styles.label}>{t('howDoYouFeel')}</Text>
        <View style={styles.moodRow}>
          {moodOptions.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setSelectedMood(m)}
              style={[
                styles.moodButton,
                selectedMood === m && styles.moodSelected,
              ]}
            >
              <Text style={styles.moodText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood !== '' && (
          <View style={styles.commentBox}>
            <Text style={styles.yumiComment}>{getYumiMoodComment(selectedMood)}</Text>
          </View>
        )}

        <Text style={styles.label}>{t('writeNote')}</Text>
        <TextInput
          multiline
          style={styles.textInput}
          value={entry}
          onChangeText={setEntry}
          placeholder={t('tellYumiHowYourDayWent')}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
          <Text style={styles.saveText}>💾 {t('saveEntry')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>📚 {t('yourHistory')}</Text>
        {history.map((item, idx) => (
          <View key={idx} style={styles.entry}>
            <Text style={styles.entryMood}>{item.mood}</Text>
            <Text style={styles.entryDate}>{item.date}</Text>
            {item.note ? <Text style={styles.entryNote}>"{item.note}"</Text> : null}
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default MoodJournalScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff66aa',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    backgroundColor: '#ffffffaa',
    padding: 6,
    borderRadius: 10,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  moodButton: {
    backgroundColor: '#fff0f7',
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  moodSelected: {
    borderColor: '#ff69b4',
    borderWidth: 2,
  },
  moodText: {
    fontSize: 14,
    color: '#ff69b4',
  },
  commentBox: {
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  yumiComment: {
    fontStyle: 'italic',
    color: '#e91e63',
  },
  textInput: {
    height: 100,
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#f48fb1',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  entry: {
    backgroundColor: '#fff9fc',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  entryMood: {
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
  },
  entryNote: {
    marginTop: 4,
    fontStyle: 'italic',
  },
});
