import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

interface Props {
  visible: boolean;
  onClose: () => void;
  isPremium: boolean;
  setMessages: (updater: (prev: any[]) => any[]) => void;
}

const OfficeHelperModal: React.FC<Props> = ({ visible, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const goToHelperScreen = (screen: 'WordHelper' | 'ExcelHelper' | 'PPTHelper') => {
    onClose();
    navigation.navigate(screen as never);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>💼 请选择要使用的 Office 助手</Text>

        <TouchableOpacity onPress={() => goToHelperScreen('WordHelper')} style={styles.taskButton}>
          <Text>📄 Word 助手</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToHelperScreen('ExcelHelper')} style={styles.taskButton}>
          <Text>📊 Excel 助手</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToHelperScreen('PPTHelper')} style={styles.taskButton}>
          <Text>📽️ PPT 助手</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#ccc' }]}>
          <Text>关闭</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  taskButton: {
    backgroundColor: '#ffe4e1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
});

export default OfficeHelperModal;
