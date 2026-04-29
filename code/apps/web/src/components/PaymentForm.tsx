'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submitPayment } from "@/server/actions/payment";
import { Camera, CreditCard } from "lucide-react";

export function PaymentForm({ bookingId, amount }: { bookingId: string, amount: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("booking_id", bookingId);
    
    const res = await submitPayment(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      router.push(`/booking/${bookingId}/status`);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-2 border-b bg-muted/30 pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary h-6 w-6" /> Payment Submission
          </CardTitle>
          <CardDescription>
            Please transfer the total amount and upload your payment receipt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium text-sm">{error}</div>}
          
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Amount Due</div>
            <div className="text-3xl font-bold text-primary">Rs. {amount.toLocaleString()}</div>
          </div>

          <div className="space-y-2">
            <Label>Bank Details for Transfer</Label>
            <div className="p-3 bg-muted rounded border text-sm font-mono space-y-1">
              <div>Bank: Meezan Bank Ltd</div>
              <div>Title: 99 Cattle Farm</div>
              <div>Account: 0123-4567890123</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method Used</Label>
            <select 
              id="method"
              name="method" 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="proof_upload">Online Bank Transfer / App Screenshot</option>
            </select>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="proof_file" className="flex justify-between items-end">
              Upload Screenshot / Receipt
              <span className="text-xs text-muted-foreground font-normal">Tap to capture <Camera className="inline h-3 w-3 ml-1" /></span>
            </Label>
            <Input 
              id="proof_file" 
              name="proof_file"
              type="file" 
              accept="image/*"
              capture="environment"
              required 
              className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/20 transition-colors"
            />
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 pt-6 border-t">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Uploading..." : "Submit Payment Proof"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
