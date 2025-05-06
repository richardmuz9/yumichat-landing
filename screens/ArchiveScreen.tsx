// screens/ArchiveScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../components/LanguageContext';

const ArchiveScreen = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const stored = await AsyncStorage.getItem('yumiOfficeReports');
      if (stored) setReports(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load report history:', err);
    }
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem('yumiOfficeReports');
    setReports([]);
  };

  const handleExport = async () => {
    try {
      const content = reports.map(r => `📎 ${r.fileName}\n🧠 ${r.taskType}\n🕒 ${new Date(r.timestamp).toLocaleString()}\n${r.reply}\n\n`).join('');
      await Share.share({ message: content });
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const filteredReports = reports.filter(
    r =>
      r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.taskType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ImageBackground
      source={require('../assets/bg-archive.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📘 {t('myArchive')}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {filteredReports.length === 0 ? (
          <Text style={styles.empty}>{t('noRecords')}</Text>
        ) : (
          filteredReports.map((r, idx) => (
            <View key={idx} style={styles.reportBox}>
              <Text style={styles.label}>📎 {r.fileName}</Text>
              <Text style={styles.label}>🧠 任务类型: {r.taskType}</Text>
              <Text style={styles.label}>🕒 {new Date(r.timestamp).toLocaleString()}</Text>
              <Text style={styles.content}>{r.reply}</Text>
            </View>
          ))
        )}

        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Text style={styles.exportText}>📤 {t('exportRecords')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearText}>🗑 {t('clearAllRecords')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ {t('back')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  empty: {
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  reportBox: {
    marginBottom: 15,
    backgroundColor: '#fff5f8dd',
    padding: 12,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: '#ffc0cb',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#87cefa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  backText: {
    color: '#007bff',
  },
});

export default ArchiveScreen;
