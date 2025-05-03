// services/PaymentService.ts

import * as InAppPurchases from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_ID = 'com.yourcompany.yumi.premium'; // Replace with actual SKU from App Store/Google Play

export class PaymentService {
  // Initialize IAP and set up purchase listener
  static async init(): Promise<void> {
    try {
      await InAppPurchases.connectAsync();
      await InAppPurchases.getProductsAsync([SUBSCRIPTION_ID]);

      InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results.forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              // Grant premium access and acknowledge
              await AsyncStorage.setItem('isPremium', 'true');
              await InAppPurchases.finishTransactionAsync(purchase, true);
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ IAP Init Error:', error);
    }
  }

  // Start the purchase flow
  static async purchasePremium(): Promise<void> {
    try {
      await InAppPurchases.getProductsAsync([SUBSCRIPTION_ID]);
      await InAppPurchases.purchaseItemAsync(SUBSCRIPTION_ID);
    } catch (error) {
      console.error('❌ Purchase Error:', error);
    }
  }

  // Check if user is premium
  static async isPremium(): Promise<boolean> {
    return (await AsyncStorage.getItem('isPremium')) === 'true';
  }

  // (Optional) Revoke premium for testing
  static async clearPremium(): Promise<void> {
    await AsyncStorage.removeItem('isPremium');
  }
}
