import { getAdminPb } from "@/server/pb";

export interface NotificationPayload {
  type: string;
  bookingId?: string;
  customerId?: string;
  channel?: 'mock_whatsapp' | 'mock_email' | 'mock_sms';
  payload?: Record<string, unknown>;
}

export const mockNotifier = {
  async send(notification: NotificationPayload) {
    try {
      const pb = await getAdminPb();
      await pb.collection('notifications_log').create({
        type: notification.type,
        booking_id: notification.bookingId,
        customer_id: notification.customerId,
        channel: notification.channel || 'mock_sms',
        payload: notification.payload || {},
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
      console.log('[MOCK NOTIFICATION]', notification.type, notification.bookingId || notification.customerId);
    } catch (error) {
      console.error('[NOTIFIER ERROR]', error);
    }
  },
};
