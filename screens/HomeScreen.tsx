import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { LanguageContext } from '../components/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/bg-study-japan.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={require('../assets/yumi-avatar.png')} style={styles.avatar} />
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle}>✨</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            },
          ]}
        >
          <Text style={styles.header}>ようこそ！</Text>
          <Text style={styles.subtext}>Yumiが貴方をサポートするよ！</Text>
        </Animated.View>

        <View style={styles.sidebarContainer}>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>{t('chat')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('MentalHealthHelper')}>
            <Ionicons name="heart-circle-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>{t('mentalHealth')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('Romance')}>
            <Ionicons name="sparkles-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>{t('romance')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('PremiumFeatures')}>
            <Ionicons name="star-outline" size={24} color="#fff" />
            <Text style={styles.sidebarText}>{t('unlockPremium')}</Text>
          </TouchableOpacity>
        </View>

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
  background: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle: {
    fontSize: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtext: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsIcon: {
    fontSize: 24,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    padding: 10,
    justifyContent: 'center',
  },
  sidebarButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  sidebarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeScreen;
