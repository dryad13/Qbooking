'use server';

import { getUserPb, getAdminPb } from "@/server/pb";
import { assertTransitionAllowed } from "@/lib/stateMachine";
import { redirect } from "next/navigation";

const PRICE_NORMAL = 45000;
const PRICE_PREMIUM = 65000;
const CUTTING_ADDON = 2500;
const DELIVERY_ADDON = 3500;

export async function createBooking(formData: FormData) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return { error: "You must be logged in to create a booking." };
  }

  const userId = pb.authStore.model.id;
  
  const packageType = formData.get("package_type") as 'normal' | 'premium';
  const shares = parseInt(formData.get("total_shares") as string || "1", 10);
  const cuttingRequested = formData.get("cutting_requested") === "on";
  const deliveryRequested = formData.get("delivery_requested") === "on";

  if (!['normal', 'premium'].includes(packageType)) return { error: "Invalid package type." };
  if (shares < 1 || shares > 7) return { error: "Shares must be between 1 and 7." };

  // Pricing calculations
  const pricePerShare = packageType === 'premium' ? PRICE_PREMIUM : PRICE_NORMAL;
  const subtotal = pricePerShare * shares;
  const addonsTotal = (cuttingRequested ? CUTTING_ADDON : 0) + (deliveryRequested ? DELIVERY_ADDON : 0);
  const grandTotal = subtotal + addonsTotal;

  // State Machine Validation
  assertTransitionAllowed(null, 'draft', 'customer');
  assertTransitionAllowed('draft', 'awaiting_kyc', 'customer'); // Auto progress to awaiting_kyc

  try {
    const adminPb = await getAdminPb();
    
    // Create the booking record
    const booking = await adminPb.collection('bookings').create({
      booking_reference: `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customer_id: userId,
      package_type: packageType,
      status: 'awaiting_kyc',
      total_shares: shares,
      subtotal,
      addons_total: addonsTotal,
      grand_total: grandTotal,
      cutting_requested: cuttingRequested,
      delivery_requested: deliveryRequested,
    });

    // Create the booking share records
    await adminPb.collection('booking_shares').create({
      booking_id: booking.id,
      share_count: shares,
      package_type: packageType,
      price_per_share: pricePerShare,
      line_total: subtotal,
      addons: { cutting: cuttingRequested, delivery: deliveryRequested }
    });

    // Audit Log
    await adminPb.collection('audit_logs').create({
      actor_id: userId,
      entity_type: 'booking',
      entity_id: booking.id,
      action: 'created_and_auto_transition_to_awaiting_kyc',
      before: null,
      after: booking,
      timestamp: new Date().toISOString()
    });

    return { success: true, reference: booking.id };
  } catch (error: any) {
    console.error("[CREATE BOOKING ERROR]", error);
    return { error: error.message || "Failed to create booking." };
  }
}
