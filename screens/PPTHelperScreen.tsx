import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenRouterService } from '../services/OpenRouterService';
import { LanguageContext } from '../components/LanguageContext';

const PPTHelperScreen = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const { t } = useContext(LanguageContext);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      });
      if (!result.canceled) {
        const name = result.assets[0].name;
        setFileName(name);
        Alert.alert(t('fileSelectedTitle'), name);
      }
    } catch (err) {
      Alert.alert(t('errorTitle'), t('fileSelectError'));
    }
  };

  const handleTask = async (type: string, prompt: string, yumiTag: string) => {
    if (!fileName) {
      Alert.alert(t('warningTitle'), t('selectFileFirst'));
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
      Alert.alert(t('taskCompleteTitle'), `${yumiTag}\n\n${reply}`);
    } catch (err) {
      Alert.alert(t('errorTitle'), t('taskFailed'));
    }
  };

  return (
    <ImageBackground source={require('../assets/yumi-ppt.png')} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('pptHelperTitle')}</Text>

        <TouchableOpacity onPress={handleFileSelect} style={styles.selectButton}>
          <Text style={styles.selectText}>{t('selectPptFile')}</Text>
        </TouchableOpacity>

        {fileName && <Text style={styles.fileText}>{t('selectedFile')}: {fileName}</Text>}

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'ppt-outline',
            fileName ? `${t('pptOutlinePrompt')} ${fileName}` : t('pptOutlinePrompt'),
            t('pptOutlineTag')
          )}
        >
          <Text>{t('pptOutline')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'slide-layout',
            fileName ? `${t('slideLayoutPrompt')} ${fileName}` : t('slideLayoutPrompt'),
            t('slideLayoutTag')
          )}
        >
          <Text>{t('slideLayout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'slide-translate',
            fileName ? `${t('slideTranslatePrompt')} ${fileName}` : t('slideTranslatePrompt'),
            t('slideTranslateTag')
          )}
        >
          <Text>{t('slideTranslate')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'generate-notes',
            fileName ? `${t('generateNotesPrompt')} ${fileName}` : t('generateNotesPrompt'),
            t('generateNotesTag')
          )}
        >
          <Text>{t('generateNotes')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'related-slides',
            fileName ? `${t('relatedSlidesPrompt')} ${fileName}` : t('relatedSlidesPrompt'),
            t('relatedSlidesTag')
          )}
        >
          <Text>{t('relatedSlides')}</Text>
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
    color: '#d63384',
  },
  selectButton: {
    backgroundColor: '#ffe6f0',
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
    backgroundColor: '#ffeff6',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    width: '90%',
    alignItems: 'center',
  },
});

export default PPTHelperScreen;
