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
import  { LanguageContext } from '../components/LanguageContext';

const ExcelHelperScreen = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const { t } = useContext(LanguageContext);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
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
    <ImageBackground source={require('../assets/yumi-excel.png')} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('excelHelperTitle')}</Text>

        <TouchableOpacity onPress={handleFileSelect} style={styles.selectButton}>
          <Text style={styles.selectText}>{t('selectExcelFile')}</Text>
        </TouchableOpacity>

        {fileName && <Text style={styles.fileText}>{t('selectedFile')}: {fileName}</Text>}

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'excel-clean',
            fileName ? `${t('excelCleanPrompt')} ${fileName}` : t('excelCleanPrompt'),
            t('excelCleanTag')
          )}
        >
          <Text>{t('excelClean')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'generate-chart',
            fileName ? `${t('generateChartPrompt')} ${fileName}` : t('generateChartPrompt'),
            t('generateChartTag')
          )}
        >
          <Text>{t('generateChart')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'trend-analysis',
            fileName ? `${t('trendAnalysisPrompt')} ${fileName}` : t('trendAnalysisPrompt'),
            t('trendAnalysisTag')
          )}
        >
          <Text>{t('trendAnalysis')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'formula-explain',
            fileName ? `${t('formulaExplainPrompt')} ${fileName}` : t('formulaExplainPrompt'),
            t('formulaExplainTag')
          )}
        >
          <Text>{t('formulaExplain')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskButton}
          onPress={() => handleTask(
            'data-transform',
            fileName ? `${t('dataTransformPrompt')} ${fileName}` : t('dataTransformPrompt'),
            t('dataTransformTag')
          )}
        >
          <Text>{t('dataTransform')}</Text>
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
    color: '#28a745',
  },
  selectButton: {
    backgroundColor: '#e6fff0',
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
    backgroundColor: '#e0ffe4',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    width: '90%',
    alignItems: 'center',
  },
});

export default ExcelHelperScreen;
