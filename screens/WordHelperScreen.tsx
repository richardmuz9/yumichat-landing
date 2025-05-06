import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenRouterService } from '../services/OpenRouterService';
import { LanguageContext } from '../components/LanguageContext';

const WordHelperScreen = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const { t } = useContext(LanguageContext);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled) {
        const name = result.assets[0].name;
        setFileName(name);
        Alert.alert(t('fileSelectedTitle'), name);
      }
    } catch (err) {
      Alert.alert(t('fileSelectErrorTitle'), t('fileSelectErrorMessage'));
    }
  };

  const handleTask = async (type: string, prompt: string, yumiTag: string) => {
    if (!fileName) {
      Alert.alert(t('noFileSelectedTitle'));
      return;
    }
    try {
      const reply = await OpenRouterService.sendMessage(prompt);
      const history = await AsyncStorage.getItem('yumiOfficeReports');
      const list = history ? JSON.parse(history) : [];
      const newEntry = {
        fileName,
        taskType: type,
        reply,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem('yumiOfficeReports', JSON.stringify([newEntry, ...list.slice(0, 49)]));
      Alert.alert(t('taskCompletedTitle'), `${yumiTag}\n\n${reply}`);
    } catch (err) {
      Alert.alert(t('taskFailedTitle'), t('taskFailedMessage'));
    }
  };

  return (
    <ImageBackground source={require('../assets/yumi-word.png')} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('wordHelperTitle')}</Text>

        <TouchableOpacity onPress={handleFileSelect} style={styles.selectButton}>
          <Text style={styles.selectText}>{t('selectWordFile')}</Text>
        </TouchableOpacity>

        {fileName && <Text style={styles.fileText}>{t('selectedFile')}: {fileName}</Text>}

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'summarize',
            fileName ? `${t('summarizePrompt')} ${fileName}` : t('summarizePrompt'),
            t('summarizeTag')
          )}
        >
          <Text>{t('summarize')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'outline',
            fileName ? `${t('outlinePrompt')} ${fileName}` : t('outlinePrompt'),
            t('outlineTag')
          )}
        >
          <Text>{t('outline')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'auto-format',
            fileName ? `${t('autoFormatPrompt')} ${fileName}` : t('autoFormatPrompt'),
            t('autoFormatTag')
          )}
        >
          <Text>{t('autoFormat')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'citation',
            fileName ? `${t('citationPrompt')} ${fileName}` : t('citationPrompt'),
            t('citationTag')
          )}
        >
          <Text>{t('citation')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'clarity',
            fileName ? `${t('clarityPrompt')} ${fileName}` : t('clarityPrompt'),
            t('clarityTag')
          )}
        >
          <Text>{t('clarity')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#ff69b4',
  },
  selectButton: {
    backgroundColor: '#fff0f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileText: {
    marginVertical: 10,
    fontStyle: 'italic',
  },
  taskButton: {
    backgroundColor: '#ffe4e1',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    width: '90%',
    alignItems: 'center',
  },
});

export default WordHelperScreen;
