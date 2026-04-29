import { getAdminPb, getUserPb } from "@/server/pb";
import { QRCodeSVG } from "qrcode.react";
import { PrintButton } from "@/components/PrintButton";

const CUTTING_ADDON = 2500;
const DELIVERY_ADDON = 3500;

export default async function SlipPage({ params }: { params: { ref: string } }) {
  const pb = await getUserPb();
  if (!pb.authStore.isValid) {
    return <div className="p-8 text-center text-destructive">Unauthorized. Please log in.</div>;
  }

  const adminPb = await getAdminPb();
  let booking;
  try {
    booking = await adminPb.collection('bookings').getOne(params.ref, { expand: 'customer_id' });
  } catch (e) {
    return <div className="p-8 text-center text-destructive">Booking not found.</div>;
  }

  if (booking.customer_id !== pb.authStore.model?.id) {
    return <div className="p-8 text-center text-destructive">Unauthorized access to booking.</div>;
  }

  const customer = booking.expand?.customer_id;

  return (
    <div className="min-h-screen bg-muted/30 p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-2xl font-bold">Booking Slip</h1>
        <PrintButton />
      </div>

      {/* Printable Slip Container */}
      <div className="bg-white text-black p-8 sm:p-12 w-full max-w-3xl shadow-xl border print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold uppercase tracking-widest text-black">99 Cattle Farm</h2>
            <p className="text-sm font-medium mt-1">Qurbani Booking Slip</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold mb-1">REFERENCE</p>
            <p className="text-2xl font-mono">{booking.booking_reference}</p>
          </div>
        </div>

        {/* Core Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">Customer Details</p>
            <p className="font-bold text-lg">{customer?.name || "Valued Customer"}</p>
            <p className="font-mono text-sm">{customer?.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">Status</p>
            <p className="font-bold text-lg text-green-700 uppercase">{booking.status.replaceAll('_', ' ')}</p>
          </div>
        </div>

        {/* Booking Details Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold uppercase text-xs">Description</th>
                <th className="py-2 font-bold uppercase text-xs text-right">Shares</th>
                <th className="py-2 font-bold uppercase text-xs text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 capitalize">{booking.package_type} Package Share</td>
                <td className="py-3 text-right">{booking.total_shares}</td>
                <td className="py-3 text-right">Rs. {booking.subtotal.toLocaleString()}</td>
              </tr>
              {booking.cutting_requested && (
                <tr className="border-b">
                  <td className="py-3">Cutting Service</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right">Rs. {CUTTING_ADDON.toLocaleString()}</td>
                </tr>
              )}
              {booking.delivery_requested && (
                <tr className="border-b">
                  <td className="py-3">Home Delivery</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right">Rs. {DELIVERY_ADDON.toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <td className="py-4 font-bold text-lg text-right" colSpan={2}>Grand Total Paid</td>
                <td className="py-4 font-bold text-xl text-right">Rs. {booking.grand_total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer & QR */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t-2 border-dashed border-gray-300">
          <div className="max-w-[60%]">
            <h3 className="font-bold mb-2">Important Instructions:</h3>
            <ul className="text-sm list-disc pl-4 space-y-1 text-gray-700">
              <li>Please bring this printed slip for physical pickup.</li>
              <li>Show the QR code at the gate for fast-track verification.</li>
              <li>Slaughter slots will be assigned 24 hours before Eid.</li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <QRCodeSVG value={`https://99cattle.farm/verify/${booking.id}`} size={120} level="H" />
            <p className="text-xs font-mono mt-2 text-center text-gray-500">Scan at Gate</p>
          </div>
        </div>

      </div>
    </div>
  );
}
