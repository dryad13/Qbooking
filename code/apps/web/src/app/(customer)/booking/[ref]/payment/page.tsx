import { getAdminPb, getUserPb } from "@/server/pb";
import { PaymentForm } from "@/components/PaymentForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/30 p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold">Payment Not Required Yet</h2>
        <p className="text-muted-foreground">Your booking is currently: {booking.status.replace('_', ' ').toUpperCase()}</p>
        <Button asChild>
          <Link href={`/booking/${booking.id}/status`}>Go to Status Portal</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8">
      <PaymentForm bookingId={booking.id} amount={booking.grand_total} />
    </div>
  );
}
