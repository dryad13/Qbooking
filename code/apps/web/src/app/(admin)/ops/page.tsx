import { getAdminPb } from "@/server/pb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewKyc, reviewPayment } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OpsDashboard() {
  const pb = await getAdminPb();
  
  // Fetch pending KYC
  const pendingKyc = await pb.collection('bookings').getFullList({
    filter: 'status="awaiting_kyc"',
    expand: 'current_kyc_id,customer_id',
    sort: '-created'
  });

  // Fetch pending Payments
  const pendingPayments = await pb.collection('bookings').getFullList({
    filter: 'status="payment_review"',
    expand: 'current_payment_id,customer_id',
    sort: '-created'
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Ops Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* KYC Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              KYC Queue 
              <span className="bg-amber-100 text-amber-800 text-sm py-1 px-3 rounded-full">{pendingKyc.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingKyc.length === 0 ? (
              <p className="text-muted-foreground">No pending KYC documents.</p>
            ) : (
              pendingKyc.map((booking) => {
                const kyc = booking.expand?.current_kyc_id;
                const customer = booking.expand?.customer_id;
                if (!kyc) return null;
                return (
                  <div key={booking.id} className="border p-4 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{booking.booking_reference}</div>
                        <div className="text-sm text-muted-foreground">{customer?.phone}</div>
                      </div>
                      <div className="text-sm text-right">
                        <div>ID: {kyc.id_number}</div>
                        <div className="text-muted-foreground uppercase">{kyc.id_type}</div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <form action={reviewKyc} className="flex-1 flex gap-2">
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <input type="hidden" name="kyc_id" value={kyc.id} />
                        <Button name="action" value="approve" type="submit" className="flex-1 bg-green-600 hover:bg-green-700">Approve</Button>
                        <div className="flex flex-1 gap-2">
                          <input type="text" name="reason" placeholder="Reject reason..." className="w-full text-sm rounded border px-2" />
                          <Button name="action" value="reject" type="submit" variant="destructive">Reject</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Payment Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              Payment Queue
              <span className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full">{pendingPayments.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPayments.length === 0 ? (
              <p className="text-muted-foreground">No pending payments.</p>
            ) : (
              pendingPayments.map((booking) => {
                const payment = booking.expand?.current_payment_id;
                if (!payment) return null;
                return (
                  <div key={booking.id} className="border p-4 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{booking.booking_reference}</div>
                        <div className="text-sm text-muted-foreground">Amount: Rs. {payment.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-right text-muted-foreground">
                        Method: {payment.method}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <form action={reviewPayment} className="flex-1 flex gap-2">
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <input type="hidden" name="payment_id" value={payment.id} />
                        <Button name="action" value="approve" type="submit" className="flex-1 bg-green-600 hover:bg-green-700">Approve</Button>
                        <div className="flex flex-1 gap-2">
                          <input type="text" name="reason" placeholder="Reject reason..." className="w-full text-sm rounded border px-2" />
                          <Button name="action" value="reject" type="submit" variant="destructive">Reject</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
