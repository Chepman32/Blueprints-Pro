/**
 * In-App Purchase Service
 * Handles consumables, non-consumables, and subscriptions
 */

import {Platform} from 'react-native';
import RNIap, {
  Product,
  Purchase,
  PurchaseError,
  SubscriptionPurchase,
  initConnection,
  endConnection,
  getProducts,
  getSubscriptions,
  requestPurchase,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';

// Product IDs
const PRODUCT_IDS = {
  PRO_UNLOCK: 'com.blueprintspro.pro_unlock',
  PREMIUM_PACK_1: 'com.blueprintspro.premium_pack_1',
  PREMIUM_PACK_2: 'com.blueprintspro.premium_pack_2',
};

const SUBSCRIPTION_IDS = {
  MONTHLY: 'com.blueprintspro.monthly',
  YEARLY: 'com.blueprintspro.yearly',
};

export class IAPService {
  private static instance: IAPService;
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): IAPService {
    if (!IAPService.instance) {
      IAPService.instance = new IAPService();
    }
    return IAPService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await initConnection();
      this.isInitialized = true;

      // Set up purchase listeners
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase successful:', purchase);
          await this.handlePurchaseUpdate(purchase);
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
        }
      );
    } catch (error) {
      console.error('IAP initialization error:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    await endConnection();
    this.isInitialized = false;
  }

  async getAvailableProducts(): Promise<Product[]> {
    try {
      const products = await getProducts({
        skus: Object.values(PRODUCT_IDS),
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getAvailableSubscriptions(): Promise<SubscriptionPurchase[]> {
    try {
      const subscriptions = await getSubscriptions({
        skus: Object.values(SUBSCRIPTION_IDS),
      });
      return subscriptions;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  async purchaseProduct(productId: string): Promise<Purchase | null> {
    try {
      const purchase = await requestPurchase({
        sku: productId,
      });
      return purchase as Purchase;
    } catch (error) {
      console.error('Purchase error:', error);
      return null;
    }
  }

  async purchaseSubscription(subscriptionId: string): Promise<Purchase | null> {
    try {
      const purchase = await requestSubscription({
        sku: subscriptionId,
      });
      return purchase as Purchase;
    } catch (error) {
      console.error('Subscription error:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<Purchase[]> {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('Restored purchases:', purchases);
      return purchases;
    } catch (error) {
      console.error('Restore purchases error:', error);
      return [];
    }
  }

  private async handlePurchaseUpdate(purchase: Purchase): Promise<void> {
    try {
      // Verify purchase on your server if needed
      // For offline app, just finish the transaction
      await finishTransaction({purchase, isConsumable: false});
      console.log('Transaction finished:', purchase.productId);
    } catch (error) {
      console.error('Error finishing transaction:', error);
    }
  }

  async isPremiumUnlocked(): Promise<boolean> {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      return purchases.some(
        (p) =>
          p.productId === PRODUCT_IDS.PRO_UNLOCK &&
          (Platform.OS === 'ios' ? p.transactionReceipt : p.purchaseToken)
      );
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }
}

export const iapService = IAPService.getInstance();
