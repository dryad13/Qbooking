import { getAdminPb, getUserPb } from "@/server/pb";
import { CheckCircle2, Clock, XCircle, CreditCard, Circle, FileText, Package } from "lucide-react";
import Link from "next/link";
import { CustomerHeader } from "@/components/CustomerHeader";

type TimelineNode = {
  label: string;
  description: string;
  state: "complete" | "current" | "rejected" | "future";
  icon: React.ElementType;
};

function buildTimeline(status: string): TimelineNode[] {
  const statusIndex: Record<string, number> = {
    awaiting_kyc: 1,
    kyc_rejected: 1,
    awaiting_payment: 2,
    payment_review: 3,
    payment_rejected: 3,
    confirmed: 5,
    fulfillment_assigned: 6,
    slaughtered: 6,
    out_for_delivery: 6,
    ready_for_pickup: 6,
    fulfilled: 6,
  };

  const currentIdx = statusIndex[status] ?? 0;
  const isKycRejected = status === "kyc_rejected";
  const isPaymentRejected = status === "payment_rejected";

  const labels = [
    { label: "Booking Created", desc: "Your booking has been placed successfully." },
    { label: "KYC Submitted", desc: isKycRejected ? "Your documents were rejected. Please resubmit." : "Your identity documents are under review." },
    { label: "KYC Approved", desc: "Your identity has been verified." },
    { label: "Payment Submitted", desc: isPaymentRejected ? "Your payment proof was rejected. Please resubmit." : "Your payment proof is under review." },
    { label: "Payment Verified", desc: "Your payment has been confirmed." },
    { label: "Booking Confirmed", desc: "Your booking is confirmed and ready for fulfillment." },
    { label: "Fulfillment", desc: "Slaughter, cutting, and delivery/pickup will be arranged." },
  ];

  return labels.map((item, idx) => {
    let state: TimelineNode["state"] = "future";
    if (idx < currentIdx) state = "complete";
    else if (idx === currentIdx) {
      if ((idx === 1 && isKycRejected) || (idx === 3 && isPaymentRejected)) {
        state = "rejected";
      } else {
        state = "current";
      }
    }

    let icon: React.ElementType = Circle;
    if (state === "complete") icon = CheckCircle2;
    else if (state === "rejected") icon = XCircle;
    else if (state === "current") {
      if (idx === 3) icon = CreditCard;
      else icon = Clock;
    }

    return { label: item.label, description: item.desc, state, icon };
  });
}

export default async function BookingStatusPage({ params }: { params: { ref: string } }) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid) {
    return <div className="p-8 text-center text-destructive">Unauthorized. Please log in.</div>;
  }

  const adminPb = await getAdminPb();
  let booking;
  try {
    booking = await adminPb.collection("bookings").getOne(params.ref, {
      expand: "current_kyc_id,current_payment_id,customer_id",
    });
  } catch (e) {
    return <div className="p-8 text-center text-destructive">Booking not found.</div>;
  }

  if (booking.customer_id !== pb.authStore.model?.id) {
    return <div className="p-8 text-center text-destructive">Unauthorized access to booking.</div>;
  }

  const timeline = buildTimeline(booking.status);
  const isConfirmed = ["confirmed", "fulfillment_assigned", "slaughtered", "out_for_delivery", "ready_for_pickup", "fulfilled"].includes(booking.status);

  return (
    <div className="min-h-screen bg-muted/30">
      <CustomerHeader bookingRef={booking.id} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Booking Status</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Reference: <span className="font-mono font-semibold text-foreground">{booking.booking_reference}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Timeline */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-6">Booking Journey</h2>
              <ol className="space-y-0">
                {timeline.map((node, idx) => {
                  const Icon = node.icon;
                  const isLast = idx === timeline.length - 1;

                  const iconColor =
                    node.state === "complete" ? "text-primary" :
                    node.state === "rejected" ? "text-destructive" :
                    node.state === "current" ? "text-amber-500" :
                    "text-muted-foreground/30";

                  const labelColor =
                    node.state === "complete" ? "text-foreground" :
                    node.state === "rejected" ? "text-destructive font-semibold" :
                    node.state === "current" ? "text-foreground font-semibold" :
                    "text-muted-foreground/40";

                  return (
                    <li key={node.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                          ${node.state === "current" ? "ring-2 ring-offset-1 ring-amber-400 bg-amber-50" : ""}
                          ${node.state === "rejected" ? "ring-2 ring-offset-1 ring-destructive bg-destructive/5" : ""}
                        `}>
                          <Icon className={`h-4 w-4 ${iconColor} ${node.state === "current" ? "animate-pulse" : ""}`} />
                        </span>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${node.state === "complete" ? "bg-primary/40" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm ${labelColor}`}>{node.label}</p>
                        {(node.state === "current" || node.state === "rejected") && (
                          <p className="text-xs text-muted-foreground mt-0.5">{node.description}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Action panel */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-4">Next Step</h2>

              {isConfirmed && (
                <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm font-semibold text-primary">Booking Confirmed!</p>
                </div>
              )}

              {booking.status === "kyc_rejected" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs font-semibold text-destructive uppercase mb-1">Rejection Reason</p>
                    <p className="text-sm">{booking.expand?.current_kyc_id?.rejection_reason || "Document was unclear."}</p>
                  </div>
                  <Link href={`/booking/${booking.id}/kyc`} className="flex w-full items-center justify-center rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors">
                    Resubmit KYC Documents
                  </Link>
                </div>
              )}

              {booking.status === "awaiting_payment" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    KYC approved. Please upload payment proof for{" "}
                    <span className="font-semibold text-foreground">Rs. {booking.grand_total?.toLocaleString()}</span>.
                  </p>
                  <Link href={`/booking/${booking.id}/payment`} className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Upload Payment Proof
                  </Link>
                </div>
              )}

              {booking.status === "payment_rejected" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs font-semibold text-destructive uppercase mb-1">Rejection Reason</p>
                    <p className="text-sm">{booking.expand?.current_payment_id?.rejection_reason || "Payment proof was unclear."}</p>
                  </div>
                  <Link href={`/booking/${booking.id}/payment`} className="flex w-full items-center justify-center rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors">
                    Resubmit Payment Proof
                  </Link>
                </div>
              )}

              {booking.status === "awaiting_kyc" && (
                <p className="text-sm text-muted-foreground">Your KYC documents are under review. We&apos;ll notify you once approved.</p>
              )}

              {booking.status === "payment_review" && (
                <p className="text-sm text-muted-foreground">Your payment proof is under review. We&apos;ll confirm your booking shortly.</p>
              )}

              {isConfirmed && (
                <div className="space-y-3 mt-3">
                  <p className="text-sm text-muted-foreground">Download your official booking slip — required for pickup/delivery.</p>
                  <Link href={`/booking/${booking.id}/slip`} className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    View & Print Booking Slip
                  </Link>
                </div>
              )}
            </div>

            {/* Booking summary */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-4">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Package</span>
                  <span className="font-medium capitalize">{booking.package_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Shares</span>
                  <span className="font-medium">{booking.total_shares}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-1">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">Rs. {booking.grand_total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
