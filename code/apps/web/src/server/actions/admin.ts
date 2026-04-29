'use server';

import { getAdminPb, getUserPb } from "@/server/pb";
import { assertTransitionAllowed } from "@/lib/stateMachine";
import { mockNotifier } from "@/lib/notifier";
import { revalidatePath } from "next/cache";

export async function reviewKyc(formData: FormData) {
  const pb = await getUserPb();
  // In a real app, verify admin role from pb.authStore.model.role
  const adminId = pb.authStore.isValid ? pb.authStore.model?.id : 'SYSTEM';

  const bookingId = formData.get("booking_id") as string;
  const kycId = formData.get("kyc_id") as string;
  const action = formData.get("action") as 'approve' | 'reject';
  const reason = formData.get("reason") as string;

  if (!bookingId || !kycId || !action) return { error: "Missing required fields." };
  if (action === 'reject' && !reason) return { error: "Rejection reason is required." };

  try {
    const adminPb = await getAdminPb();
    const booking = await adminPb.collection('bookings').getOne(bookingId);
    
    const nextStatus = action === 'approve' ? 'awaiting_payment' : 'kyc_rejected';
    
    // Use the state machine to verify the transition is allowed for an 'admin'
    assertTransitionAllowed(booking.status as any, nextStatus, 'admin');

    // Update KYC document
    await adminPb.collection('kyc_documents').update(kycId, {
      status: action === 'approve' ? 'approved' : 'rejected',
      rejection_reason: action === 'reject' ? reason : null,
      reviewed_by: adminId !== 'SYSTEM' ? adminId : null,
      reviewed_at: new Date().toISOString()
    });

    // Update Booking
    const updatedBooking = await adminPb.collection('bookings').update(bookingId, {
      status: nextStatus
    });

    // Send Notification
    await mockNotifier.send({
      type: action === 'approve' ? 'kyc_approved' : 'kyc_rejected',
      bookingId,
      customerId: booking.customer_id,
      channel: 'mock_sms',
      payload: { reason }
    });

    // Audit Log
    await adminPb.collection('audit_logs').create({
      actor_id: adminId !== 'SYSTEM' ? adminId : null,
      entity_type: 'booking',
      entity_id: bookingId,
      action: action === 'approve' ? 'kyc_approved' : 'kyc_rejected',
      before: booking,
      after: updatedBooking,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/ops');
    return { success: true };
  } catch (error: any) {
    console.error("[REVIEW KYC ERROR]", error);
    return { error: error.message || "Failed to review KYC." };
  }
}

export async function reviewPayment(formData: FormData) {
  const pb = await getUserPb();
  const adminId = pb.authStore.isValid ? pb.authStore.model?.id : 'SYSTEM';

  const bookingId = formData.get("booking_id") as string;
  const paymentId = formData.get("payment_id") as string;
  const action = formData.get("action") as 'approve' | 'reject';
  const reason = formData.get("reason") as string;

  if (!bookingId || !paymentId || !action) return { error: "Missing required fields." };
  if (action === 'reject' && !reason) return { error: "Rejection reason is required." };

  try {
    const adminPb = await getAdminPb();
    const booking = await adminPb.collection('bookings').getOne(bookingId);
    
    const nextStatus = action === 'approve' ? 'confirmed' : 'payment_rejected';
    
    assertTransitionAllowed(booking.status as any, nextStatus, 'admin');

    // Update Payment
    await adminPb.collection('payments').update(paymentId, {
      status: action === 'approve' ? 'verified' : 'rejected',
      rejection_reason: action === 'reject' ? reason : null,
      reviewed_by: adminId !== 'SYSTEM' ? adminId : null,
      reviewed_at: new Date().toISOString()
    });

    // Update Booking
    const updatedBooking = await adminPb.collection('bookings').update(bookingId, {
      status: nextStatus
    });

    // Send Notification
    await mockNotifier.send({
      type: action === 'approve' ? 'payment_verified' : 'payment_rejected',
      bookingId,
      customerId: booking.customer_id,
      channel: 'mock_sms',
      payload: { reason }
    });

    // Audit Log
    await adminPb.collection('audit_logs').create({
      actor_id: adminId !== 'SYSTEM' ? adminId : null,
      entity_type: 'booking',
      entity_id: bookingId,
      action: action === 'approve' ? 'payment_approved' : 'payment_rejected',
      before: booking,
      after: updatedBooking,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/ops');
    return { success: true };
  } catch (error: any) {
    console.error("[REVIEW PAYMENT ERROR]", error);
    return { error: error.message || "Failed to review payment." };
  }
}
