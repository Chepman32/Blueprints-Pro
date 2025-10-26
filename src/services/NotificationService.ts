/**
 * Local Notification Service
 * Handles scheduling and displaying local notifications
 */

import PushNotification, {Importance} from 'react-native-push-notification';
import {Platform} from 'react-native';

export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.configure();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private configure(): void {
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Notification received:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'blueprints-pro-default',
          channelName: 'Default',
          channelDescription: 'Default notification channel',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );

      PushNotification.createChannel(
        {
          channelId: 'blueprints-pro-reminders',
          channelName: 'Reminders',
          channelDescription: 'Blueprint reminder notifications',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => console.log(`Reminders channel created: ${created}`)
      );
    }
  }

  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions((permissions) => {
        resolve(!!permissions);
      });
    });
  }

  async checkPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  scheduleNotification(notification: ScheduledNotification): void {
    PushNotification.localNotificationSchedule({
      id: notification.id,
      channelId: 'blueprints-pro-reminders',
      title: notification.title,
      message: notification.message,
      date: notification.date,
      userInfo: notification.data,
      allowWhileIdle: true,
    });
  }

  showImmediateNotification(title: string, message: string, data?: any): void {
    PushNotification.localNotification({
      channelId: 'blueprints-pro-default',
      title,
      message,
      userInfo: data,
    });
  }

  cancelNotification(id: string): void {
    PushNotification.cancelLocalNotification(id);
  }

  cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  getScheduledNotifications(): Promise<any[]> {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  // Helper method to schedule a reminder for a blueprint
  scheduleB lueprintReminder(
    blueprintId: string,
    blueprintTitle: string,
    reminderDate: Date
  ): void {
    this.scheduleNotification({
      id: `blueprint_${blueprintId}`,
      title: 'Blueprint Reminder',
      message: `Don't forget to work on: ${blueprintTitle}`,
      date: reminderDate,
      data: {
        type: 'blueprint_reminder',
        blueprintId,
      },
    });
  }

  // Helper method to show export completion notification
  showExportCompleteNotification(blueprintTitle: string, format: string): void {
    this.showImmediateNotification(
      'Export Complete',
      `${blueprintTitle} has been exported as ${format}`,
      {
        type: 'export_complete',
        format,
      }
    );
  }

  setBadgeCount(count: number): void {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  clearBadge(): void {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

export const notificationService = NotificationService.getInstance();
