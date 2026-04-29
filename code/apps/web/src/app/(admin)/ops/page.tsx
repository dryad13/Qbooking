import { getAdminPb, getUserPb } from "@/server/pb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewKyc, reviewPayment } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Users, Clock, CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OpsDashboard() {
  const userPb = await getUserPb();
  if (!userPb.authStore.isValid) {
    redirect("/login");
  }

  const pb = await getAdminPb();

  async function handleReviewKyc(fd: FormData) {
    "use server";
    await reviewKyc(fd);
  }
  async function handleReviewPayment(fd: FormData) {
    "use server";
    await reviewPayment(fd);
  }

  const [pendingKyc, pendingPayments, totalResult, confirmedResult] = await Promise.all([
    pb.collection("bookings").getFullList({
      filter: 'status="awaiting_kyc"',
      expand: "current_kyc_id,customer_id",
      sort: "-created",
    }),
    pb.collection("bookings").getFullList({
      filter: 'status="payment_review"',
      expand: "current_payment_id,customer_id",
      sort: "-created",
    }),
    pb.collection("bookings").getList(1, 1, {}),
    pb.collection("bookings").getList(1, 1, { filter: 'status="confirmed"' }),
  ]);

  const stats = [
    { label: "Total Bookings", value: totalResult.totalItems, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending KYC", value: pendingKyc.length, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Payments", value: pendingPayments.length, icon: CreditCard, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Confirmed", value: confirmedResult.totalItems, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div>
            <h1 className="text-lg font-bold">Operations Dashboard</h1>
            <p className="text-xs text-muted-foreground">99 Cattle Farm — Admin Panel</p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border">Internal Use Only</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                  <span className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </span>
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Queues */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* KYC Queue */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-amber-50/50">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" /> KYC Queue
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold py-1 px-3 rounded-full">{pendingKyc.length} pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {pendingKyc.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">All clear — no pending KYC documents.</p>
              ) : (
                pendingKyc.map((booking) => {
                  const kyc = booking.expand?.current_kyc_id;
                  const customer = booking.expand?.customer_id;
                  if (!kyc) return null;
                  return (
                    <div key={booking.id} className="border rounded-lg p-4 bg-white hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-sm">{booking.booking_reference}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{customer?.phone}</div>
                        </div>
                        <div className="text-xs text-right">
                          <div className="font-medium">{kyc.id_number}</div>
                          <div className="text-muted-foreground uppercase">{kyc.id_type}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <form action={handleReviewKyc} className="flex-1 flex gap-2">
                          <input type="hidden" name="booking_id" value={booking.id} />
                          <input type="hidden" name="kyc_id" value={kyc.id} />
                          <Button name="action" value="approve" type="submit" size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                          <input type="text" name="reason" placeholder="Rejection reason..." className="flex-1 text-xs rounded-md border border-input px-2 py-1 bg-background" />
                          <Button name="action" value="reject" type="submit" size="sm" variant="destructive">Reject</Button>
                        </form>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Payment Queue */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-violet-50/50">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-violet-600" /> Payment Queue
                </span>
                <span className="bg-violet-100 text-violet-800 text-xs font-bold py-1 px-3 rounded-full">{pendingPayments.length} pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {pendingPayments.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">All clear — no pending payments.</p>
              ) : (
                pendingPayments.map((booking) => {
                  const payment = booking.expand?.current_payment_id;
                  if (!payment) return null;
                  return (
                    <div key={booking.id} className="border rounded-lg p-4 bg-white hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-sm">{booking.booking_reference}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Rs. {payment.amount?.toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-right text-muted-foreground">{payment.method}</div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <form action={handleReviewPayment} className="flex-1 flex gap-2">
                          <input type="hidden" name="booking_id" value={booking.id} />
                          <input type="hidden" name="payment_id" value={payment.id} />
                          <Button name="action" value="approve" type="submit" size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                          <input type="text" name="reason" placeholder="Rejection reason..." className="flex-1 text-xs rounded-md border border-input px-2 py-1 bg-background" />
                          <Button name="action" value="reject" type="submit" size="sm" variant="destructive">Reject</Button>
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
    </div>
  );
}
