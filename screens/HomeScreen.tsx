import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/bg-study-japan.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../assets/yumi-avatar.png')} style={styles.avatar} />
        <Text style={styles.header}>ようこそ！</Text>
        <Text style={styles.subtext}>Yumiが日本留学をサポートするよ！</Text>

        <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.buttonText}>Start Chat with Yumi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    marginTop: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 15,
  },
  chatButton: {
    backgroundColor: '#ff80ab',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 6,
  },
  settingsIcon: {
    fontSize: 22,
  },
});

export default HomeScreen;
