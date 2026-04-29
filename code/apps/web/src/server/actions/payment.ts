'use server';

import { getUserPb, getAdminPb } from "@/server/pb";
import { assertTransitionAllowed } from "@/lib/stateMachine";
import { revalidatePath } from "next/cache";

export async function submitPayment(formData: FormData) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return { error: "Unauthorized." };
  }

  const userId = pb.authStore.model.id;
  const bookingId = formData.get("booking_id") as string;
  const method = formData.get("method") as string;
  const proofFile = formData.get("proof_file") as File;

  if (!bookingId || !method || !proofFile) {
    return { error: "Payment method and proof document are required." };
  }

  try {
    const adminPb = await getAdminPb();
    const booking = await adminPb.collection('bookings').getOne(bookingId);
    
    if (booking.customer_id !== userId) {
      return { error: "Unauthorized access to booking." };
    }

    if (booking.status !== 'awaiting_payment' && booking.status !== 'payment_rejected') {
      return { error: "Booking is not in a state to accept payments." };
    }

    const isResubmission = booking.status === 'payment_rejected';
    const submissionNumber = (booking.payment_resubmission_count || 0) + 1;

    // Create the Payment record
    const paymentData = new FormData();
    paymentData.append("booking_id", bookingId);
    paymentData.append("customer_id", userId);
    paymentData.append("amount", booking.grand_total.toString());
    paymentData.append("method", method);
    paymentData.append("proof_file", proofFile);
    paymentData.append("status", "pending");
    paymentData.append("submission_number", submissionNumber.toString());

    const paymentRecord = await adminPb.collection('payments').create(paymentData);

    // Update booking state
    const updates: any = {
      current_payment_id: paymentRecord.id,
      payment_resubmission_count: submissionNumber
    };

    assertTransitionAllowed(booking.status as any, 'payment_review', 'customer');
    updates.status = 'payment_review';
    
    // Audit log for state change
    await adminPb.collection('audit_logs').create({
      actor_id: userId,
      entity_type: 'booking',
      entity_id: booking.id,
      action: isResubmission ? 'payment_resubmitted' : 'payment_submitted',
      before: booking,
      after: { ...booking, ...updates },
      timestamp: new Date().toISOString()
    });

    await adminPb.collection('bookings').update(bookingId, updates);
    revalidatePath(`/booking/${bookingId}/status`);

    return { success: true };
  } catch (error: any) {
    console.error("[PAYMENT ERROR]", error);
    return { error: error.message || "Failed to submit payment proof." };
  }
}
