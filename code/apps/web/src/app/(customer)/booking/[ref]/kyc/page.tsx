'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submitKyc } from "@/server/actions/kyc";
import { Camera, FileText } from "lucide-react";
import { CustomerHeader } from "@/components/CustomerHeader";
import { BookingProgress } from "@/components/BookingProgress";

export default function KycUploadPage({ params }: { params: { ref: string } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("booking_id", params.ref);
    
    const res = await submitKyc(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      router.push(`/booking/${params.ref}/status`);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CustomerHeader backHref="/" backLabel="Home" />
      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <BookingProgress currentStep={2} status="awaiting_kyc" />
          <Card className="w-full shadow-lg mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-2 border-b bg-muted/30 pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-primary h-6 w-6" /> KYC Verification
            </CardTitle>
            <CardDescription>
              We need to verify your identity to process the booking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="id_type">ID Type</Label>
              <select 
                id="id_type"
                name="id_type" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="cnic">CNIC</option>
                <option value="nid">National ID</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_number">ID Number</Label>
              <Input 
                id="id_number" 
                name="id_number"
                type="text" 
                placeholder="12345-6789012-3" 
                required 
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Upload Documents</h3>
              
              <div className="space-y-2">
                <Label htmlFor="doc_front" className="flex justify-between items-end">
                  Front Side
                  <span className="text-xs text-muted-foreground font-normal">Tap to capture <Camera className="inline h-3 w-3 ml-1" /></span>
                </Label>
                <Input 
                  id="doc_front" 
                  name="doc_front"
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  required 
                  className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc_back" className="flex justify-between items-end">
                  Back Side
                  <span className="text-xs text-muted-foreground font-normal">Tap to capture <Camera className="inline h-3 w-3 ml-1" /></span>
                </Label>
                <Input 
                  id="doc_back" 
                  name="doc_back"
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  required 
                  className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/20 transition-colors"
                />
              </div>
            </div>

          </CardContent>
          <CardFooter className="bg-muted/30 pt-6 border-t">
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Uploading..." : "Submit Documents"}
            </Button>
          </CardFooter>
        </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
