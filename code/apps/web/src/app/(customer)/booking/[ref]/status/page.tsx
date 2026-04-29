import { getAdminPb, getUserPb } from "@/server/pb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, FileText, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BookingStatusPage({ params }: { params: { ref: string } }) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid) {
    return <div className="p-8 text-center text-destructive">Unauthorized. Please log in.</div>;
  }

  const adminPb = await getAdminPb();
  let booking;
  try {
    booking = await adminPb.collection('bookings').getOne(params.ref, { expand: 'current_kyc_id,current_payment_id' });
  } catch (e) {
    return <div className="p-8 text-center text-destructive">Booking not found.</div>;
  }

  if (booking.customer_id !== pb.authStore.model?.id) {
    return <div className="p-8 text-center text-destructive">Unauthorized access to booking.</div>;
  }

  const statusMap: Record<string, { title: string, desc: string, icon: any, color: string }> = {
    awaiting_kyc: { title: "KYC Under Review", desc: "Your identity documents have been submitted and are pending admin approval.", icon: Clock, color: "text-amber-500" },
    kyc_rejected: { title: "KYC Rejected", desc: "Your KYC was rejected. Please re-upload.", icon: XCircle, color: "text-destructive" },
    awaiting_payment: { title: "Awaiting Payment", desc: "Your KYC was approved! Please submit your payment.", icon: CreditCard, color: "text-blue-500" },
    payment_review: { title: "Payment Under Review", desc: "Your payment proof is pending admin approval.", icon: Clock, color: "text-amber-500" },
    payment_rejected: { title: "Payment Rejected", desc: "Your payment proof was rejected. Please re-upload.", icon: XCircle, color: "text-destructive" },
    confirmed: { title: "Booking Confirmed", desc: "Your booking is confirmed! Waiting for fulfillment assignment.", icon: CheckCircle2, color: "text-green-500" },
  };

  const statusInfo = statusMap[booking.status] || { title: booking.status, desc: "Status unknown.", icon: Clock, color: "text-muted-foreground" };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Status</h1>
          <p className="text-muted-foreground">Reference: {booking.booking_reference}</p>
        </div>

        <Card className="border-primary shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className={`p-3 rounded-full bg-muted ${statusInfo.color}`}>
              <StatusIcon className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
              <CardDescription className="text-base">{statusInfo.desc}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            
            {booking.status === 'kyc_rejected' && (
              <div className="mt-4 p-4 border border-destructive bg-destructive/10 rounded-lg">
                <h4 className="font-bold text-destructive mb-1">Reason for Rejection:</h4>
                <p>{booking.expand?.current_kyc_id?.rejection_reason || "Document was blurry."}</p>
                <Button asChild className="mt-4 w-full" variant="destructive">
                  <Link href={`/booking/${booking.id}/kyc`}>Resubmit KYC</Link>
                </Button>
              </div>
            )}

            {booking.status === 'awaiting_payment' && (
              <div className="mt-4 p-4 border border-blue-500 bg-blue-500/10 rounded-lg">
                <h4 className="font-bold text-blue-700 mb-1">Action Required</h4>
                <p className="text-blue-900 text-sm mb-4">Please upload your payment proof for Rs. {booking.grand_total.toLocaleString()} to confirm your booking.</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={`/booking/${booking.id}/payment`}>Upload Payment Proof</Link>
                </Button>
              </div>
            )}

            {['confirmed', 'fulfillment_assigned', 'slaughtered', 'out_for_delivery', 'ready_for_pickup', 'fulfilled'].includes(booking.status) && (
              <div className="mt-4 p-4 border border-green-500 bg-green-500/10 rounded-lg">
                <h4 className="font-bold text-green-700 mb-1">Booking Confirmed!</h4>
                <p className="text-green-900 text-sm mb-4">Your payment has been verified. You can now download your official booking slip which is required for fulfillment.</p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={`/booking/${booking.id}/slip`}>View & Print Booking Slip</Link>
                </Button>
              </div>
            )}

            {/* In a real app we'd map over a timeline array. For this demo, we'll keep it simple. */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
