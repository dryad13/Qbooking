import { getAdminPb, getUserPb } from "@/server/pb";
import { PaymentForm } from "@/components/PaymentForm";
import Link from "next/link";
import { CustomerHeader } from "@/components/CustomerHeader";
import { BookingProgress } from "@/components/BookingProgress";

export default async function PaymentPage({ params }: { params: { ref: string } }) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid) {
    return <div className="p-8 text-center text-destructive">Unauthorized. Please log in.</div>;
  }

  const adminPb = await getAdminPb();
  let booking;
  try {
    booking = await adminPb.collection('bookings').getOne(params.ref);
  } catch (e) {
    return <div className="p-8 text-center text-destructive">Booking not found.</div>;
  }

  if (booking.customer_id !== pb.authStore.model?.id) {
    return <div className="p-8 text-center text-destructive">Unauthorized access to booking.</div>;
  }

  if (booking.status !== 'awaiting_payment' && booking.status !== 'payment_rejected') {
    return (
      <div className="min-h-screen bg-muted/30">
        <CustomerHeader bookingRef={booking.id} backHref={`/booking/${booking.id}/status`} backLabel="Back to Status" />
        <div className="flex flex-col items-center justify-center p-4 text-center space-y-4 pt-20">
          <h2 className="text-2xl font-bold">Payment Not Required Yet</h2>
          <p className="text-muted-foreground">Your booking is currently: {booking.status.replaceAll('_', ' ').toUpperCase()}</p>
          <Link href={`/booking/${booking.id}/status`} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Go to Status Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CustomerHeader bookingRef={booking.id} backHref={`/booking/${booking.id}/status`} backLabel="Back to Status" />
      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <BookingProgress currentStep={3} status={booking.status} />
          <div className="mt-4">
            <PaymentForm bookingId={booking.id} amount={booking.grand_total} />
          </div>
        </div>
      </div>
    </div>
  );
}
