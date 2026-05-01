'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requestOtp, demoLogin } from "@/server/actions/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError(null);
    const res = await demoLogin();
    if (res?.error) {
      setError(res.error);
      setDemoLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

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
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button type="submit" className="w-full" disabled={loading || demoLoading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled={loading || demoLoading} onClick={handleDemoLogin}>
                {demoLoading ? "Logging in..." : "Demo Login (skip OTP)"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
