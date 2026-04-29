'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createBooking } from "@/server/actions/booking";
import { Check, Info } from "lucide-react";

const PRICE_NORMAL = 45000;
const PRICE_PREMIUM = 65000;
const CUTTING_ADDON = 2500;
const DELIVERY_ADDON = 3500;

export default function BookingNewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // State for live calculator
  const [packageType, setPackageType] = useState<'normal'|'premium'>('normal');
  const [shares, setShares] = useState(1);
  const [cutting, setCutting] = useState(false);
  const [delivery, setDelivery] = useState(false);

  const subtotal = shares * (packageType === 'normal' ? PRICE_NORMAL : PRICE_PREMIUM);
  const addonsTotal = (cutting ? CUTTING_ADDON : 0) + (delivery ? DELIVERY_ADDON : 0);
  const grandTotal = subtotal + addonsTotal;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createBooking(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      router.push(`/booking/${res.reference}/kyc`);
    }
  }

  return (
    <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-8">
      <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Book Your Share</h1>
            <p className="text-muted-foreground">Select your preferences below. The final price is calculated automatically.</p>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Package Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Select Package</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <label className={`relative flex cursor-pointer flex-col rounded-lg border bg-card p-4 shadow-sm hover:border-primary ${packageType === 'normal' ? 'border-primary ring-1 ring-primary' : ''}`}>
                  <input type="radio" name="package_type" value="normal" className="sr-only" checked={packageType === 'normal'} onChange={() => setPackageType('normal')} />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-foreground">Normal Share</span>
                      <span className="mt-1 flex items-center text-sm text-muted-foreground">Standard weight cattle</span>
                      <span className="mt-4 text-lg font-bold">Rs. {PRICE_NORMAL.toLocaleString()}</span>
                    </span>
                  </span>
                  {packageType === 'normal' && <Check className="absolute top-4 right-4 h-5 w-5 text-primary" />}
                </label>

                <label className={`relative flex cursor-pointer flex-col rounded-lg border bg-card p-4 shadow-sm hover:border-primary ${packageType === 'premium' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                  <input type="radio" name="package_type" value="premium" className="sr-only" checked={packageType === 'premium'} onChange={() => setPackageType('premium')} />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-primary">Premium Share</span>
                      <span className="mt-1 flex items-center text-sm text-muted-foreground">Heavy-weight cattle</span>
                      <span className="mt-4 text-lg font-bold">Rs. {PRICE_PREMIUM.toLocaleString()}</span>
                    </span>
                  </span>
                  {packageType === 'premium' && <Check className="absolute top-4 right-4 h-5 w-5 text-primary" />}
                </label>
              </CardContent>
            </Card>

            {/* Shares */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. Number of Shares</CardTitle>
                <CardDescription>You can select up to 7 shares (one full cow).</CardDescription>
              </CardHeader>
              <CardContent>
                <select 
                  name="total_shares" 
                  value={shares} 
                  onChange={(e) => setShares(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {[1,2,3,4,5,6,7].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Share' : 'Shares'}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">3. Add-ons (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-muted/50">
                  <input type="checkbox" name="cutting_requested" checked={cutting} onChange={(e) => setCutting(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Cutting Service</div>
                    <div className="text-sm text-muted-foreground">Professional meat cutting into standard portions.</div>
                  </div>
                  <div className="font-bold">+Rs. {CUTTING_ADDON.toLocaleString()}</div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-muted/50">
                  <input type="checkbox" name="delivery_requested" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Home Delivery</div>
                    <div className="text-sm text-muted-foreground">Refrigerated delivery to your address.</div>
                  </div>
                  <div className="font-bold">+Rs. {DELIVERY_ADDON.toLocaleString()}</div>
                </label>
              </CardContent>
            </Card>

            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium">{error}</div>}
            
          </form>
        </div>

        {/* Order Summary (Sticky) */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <Card className="border-primary shadow-lg">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{shares}x {packageType === 'normal' ? 'Normal' : 'Premium'} Share</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {cutting && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cutting Add-on</span>
                    <span className="font-medium">Rs. {CUTTING_ADDON.toLocaleString()}</span>
                  </div>
                )}
                
                {delivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Add-on</span>
                    <span className="font-medium">Rs. {DELIVERY_ADDON.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-primary">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-md flex gap-2 items-start text-xs text-muted-foreground mt-4">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Payment is required after KYC verification. No charges will be made right now.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 border-t">
                <Button form="booking-form" type="submit" size="lg" className="w-full text-md font-bold" disabled={loading}>
                  {loading ? "Processing..." : "Proceed to KYC"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
