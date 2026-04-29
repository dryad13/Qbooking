'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requestOtp } from "@/server/actions/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    
    const res = await requestOtp(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Redirect to verify page with phone number in query
      router.push(`/verify?phone=${encodeURIComponent(phone)}`);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login to 99 Cattle Farm</CardTitle>
            <CardDescription>
              Enter your mobile number to receive an OTP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-destructive font-medium text-center">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel" 
                inputMode="numeric"
                placeholder="e.g. 03001234567" 
                required 
                className="text-lg"
              />
            </div>
            {process.env.NEXT_PUBLIC_MOCK_OTP_CODE && (
               <div className="text-xs text-center text-muted-foreground">
                 Demo OTP is: {process.env.NEXT_PUBLIC_MOCK_OTP_CODE}
               </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
