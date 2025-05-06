import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './components/LanguageContext';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import ArchiveScreen from './screens/ArchiveScreen';
import WordHelperScreen from './screens/WordHelperScreen';
import ExcelHelperScreen from './screens/ExcelHelperScreen';
import PPTHelperScreen from './screens/PPTHelperScreen';
import ChatHistoryModal from './screens/ChatHistoryModal';
import PremiumFeaturesScreen from './screens/PremiumFeaturesScreen'; 
import MentalHealthHelperScreen from './screens/MentalHealthHelperScreen';
import MoodJournalScreen from './screens/MoodJournalScreen';
import RomanceScreen from './screens/RomanceScreen';
import ShopScreen from './screens/ShopScreen';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('❌ App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null; // Optionally show fallback UI
    }
    return this.props.children;
  }
}

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Settings: undefined;
  Archive: undefined;
  WordHelper: undefined;
  ExcelHelper: undefined;
  PPTHelper: undefined;
  ChatHistoryModal: undefined;
  PremiumFeatures: undefined;
  MentalHealthHelper: undefined;
  MoodJournal: undefined;
  Romance: undefined;
  Shop: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Archive" component={ArchiveScreen} />
            <Stack.Screen name="WordHelper" component={WordHelperScreen} />
            <Stack.Screen name="ExcelHelper" component={ExcelHelperScreen} />
            <Stack.Screen name="PPTHelper" component={PPTHelperScreen} />
            <Stack.Screen
              name="ChatHistoryModal"
              component={ChatHistoryModal}
              options={{ presentation: 'modal', title: 'Chat History' }}
            />
            <Stack.Screen
              name="PremiumFeatures"
              component={PremiumFeaturesScreen}
              options={{ title: 'Premium Features' }}
            />
            <Stack.Screen
              name="MentalHealthHelper"
              component={MentalHealthHelperScreen}
              options={{ title: 'Mental Health Helper' }}
            />
            <Stack.Screen
              name="MoodJournal"
              component={MoodJournalScreen}
              options={{ title: 'Mood Journal' }}
            />
            <Stack.Screen
              name="Romance"
              component={RomanceScreen}
              options={{ title: 'Romance' }}
            />
            <Stack.Screen
              name="Shop"
              component={ShopScreen}
              options={{ title: 'Shop' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
