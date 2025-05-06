import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { LanguageContext } from './LanguageContext';

interface VPNHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const VPNHelpModal: React.FC<VPNHelpModalProps> = ({ visible, onClose }) => {
  const { t } = useContext(LanguageContext);

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t('vpnHeader')}</Text>

        <Text style={styles.subHeader}>{t('recommendedVPN')}</Text>
        <View style={styles.vpnBox}>
          <Text style={styles.vpnTitle}>{t('clashTitle')}</Text>
          <Text style={styles.vpnDesc}>{t('clashDesc')}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/clash-verge-rev/clash-verge-rev/releases')}>
            {t('githubLink')}
          </Text>
        </View>

        <View style={styles.vpnBox}>
          <Text style={styles.vpnTitle}>{t('nexitallyTitle')}</Text>
          <Text style={styles.vpnDesc}>{t('nexitallyDesc')}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://nexitally.com')}>
            {t('officialLink')}
          </Text>
        </View>

        <View style={styles.vpnBox}>
          <Text style={styles.vpnTitle}>{t('vpnChinaTitle')}</Text>
          <Text style={styles.vpnDesc}>{t('vpnChinaDesc')}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://vpnchina.net')}>
            {t('officialLink')}
          </Text>
        </View>

        <View style={styles.vpnBox}>
          <Text style={styles.vpnTitle}>{t('lanternTitle')}</Text>
          <Text style={styles.vpnDesc}>{t('lanternDesc')}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://getlantern.org')}>
            {t('officialLink')}
          </Text>
        </View>

        <View style={styles.vpnBox}>
          <Text style={styles.vpnTitle}>{t('outlineTitle')}</Text>
          <Text style={styles.vpnDesc}>{t('outlineDesc')}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://getoutline.org')}>
            {t('officialLink')}
          </Text>
        </View>

        <Text style={styles.subHeader}>{t('windowsTutorial')}</Text>
        <Text style={styles.text}>{t('windowsStep1')}</Text>
        <Text style={styles.text}>{t('windowsStep2')}</Text>
        <Text style={styles.text}>{t('windowsStep3')}</Text>

        <Text style={styles.subHeader}>{t('macTutorial')}</Text>
        <Text style={styles.text}>{t('macStep1')}</Text>
        <Text style={styles.text}>{t('macStep2')}</Text>
        <Text style={styles.text}>{t('macStep3')}</Text>

        <Text style={styles.subHeader}>{t('qrCode')}</Text>
        <Image source={require('../assets/vpn_qr.png')} style={styles.qrImage} />
        <Text style={styles.textCenter}>{t('qrCodeDesc')}</Text>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>{t('close')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
  },
  vpnBox: {
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  vpnTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },
  vpnDesc: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 4,
    color: '#555',
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  textCenter: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VPNHelpModal;