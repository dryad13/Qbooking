'use server';

import { getUserPb, getAdminPb } from "@/server/pb";
import { assertTransitionAllowed } from "@/lib/stateMachine";
import { revalidatePath } from "next/cache";

export async function submitKyc(formData: FormData) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return { error: "Unauthorized." };
  }

  const userId = pb.authStore.model.id;
  const bookingId = formData.get("booking_id") as string;
  const idNumber = formData.get("id_number") as string;
  const idType = formData.get("id_type") as string;
  const docFront = formData.get("doc_front") as File;
  const docBack = formData.get("doc_back") as File;

  if (!bookingId || !idNumber || !idType || !docFront || !docBack) {
    return { error: "All fields and files are required." };
  }

  try {
    const adminPb = await getAdminPb();
    
    // Fetch the booking to verify ownership and state
    const booking = await adminPb.collection('bookings').getOne(bookingId);
    
    if (booking.customer_id !== userId) {
      return { error: "Unauthorized access to booking." };
    }

    if (booking.status !== 'awaiting_kyc' && booking.status !== 'kyc_rejected') {
      return { error: "Booking is not in a state to accept KYC documents." };
    }

    const isResubmission = booking.status === 'kyc_rejected';
    const submissionNumber = (booking.kyc_resubmission_count || 0) + 1;

    // Create the KYC document record
    const kycData = new FormData();
    kycData.append("booking_id", bookingId);
    kycData.append("customer_id", userId);
    kycData.append("id_number", idNumber);
    kycData.append("id_type", idType);
    kycData.append("doc_front", docFront);
    kycData.append("doc_back", docBack);
    kycData.append("status", "pending");
    kycData.append("submission_number", submissionNumber.toString());

    const kycRecord = await adminPb.collection('kyc_documents').create(kycData);

    // Update booking state
    const updates: any = {
      current_kyc_id: kycRecord.id,
      kyc_resubmission_count: submissionNumber
    };

    if (isResubmission) {
      assertTransitionAllowed('kyc_rejected', 'awaiting_kyc', 'customer');
      updates.status = 'awaiting_kyc';
      
      // Audit log for state change
      await adminPb.collection('audit_logs').create({
        actor_id: userId,
        entity_type: 'booking',
        entity_id: booking.id,
        action: 'kyc_resubmitted',
        before: booking,
        after: { ...booking, ...updates },
        timestamp: new Date().toISOString()
      });
    }

    await adminPb.collection('bookings').update(bookingId, updates);
    revalidatePath(`/booking/${bookingId}/status`);

    return { success: true };
  } catch (error: any) {
    console.error("[KYC ERROR]", error);
    return { error: error.message || "Failed to submit KYC documents." };
  }
}
