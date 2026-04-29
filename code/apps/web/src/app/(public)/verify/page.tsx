'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyOtp } from "@/server/actions/auth";

function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (!phone) {
      router.push("/login");
    }
  }, [phone, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("phone", phone || "");
    
    const res = await verifyOtp(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // In a real app, we'd check if they have an active booking to redirect to /booking/[ref]/status
      router.push(`/booking/new`);
    }
  }

  if (!phone) return null;

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Number</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP sent to {phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-destructive font-medium text-center">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input 
              id="otp" 
              name="otp"
              type="text" 
              inputMode="numeric"
              maxLength={6}
              placeholder="123456" 
              required 
              className="text-lg text-center tracking-widest"
              autoComplete="one-time-code"
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {timeLeft > 0 ? (
              <span>Code expires in <span className="font-medium text-foreground">{formatTime(timeLeft)}</span></span>
            ) : (
              <span className="text-destructive">Code expired. Please request a new one.</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading || timeLeft <= 0}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/30 px-4">
      <Suspense fallback={<Card className="w-full max-w-md p-8 text-center"><p>Loading...</p></Card>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
