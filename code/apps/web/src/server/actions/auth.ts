'use server';

import { getAdminPb } from "@/server/pb";
import { mockNotifier } from "@/lib/notifier";
import { cookies } from "next/headers";

const MOCK_OTP = process.env.MOCK_OTP_CODE || "123456";
const OTP_EXPIRY_SECONDS = parseInt(process.env.OTP_EXPIRY_SECONDS || "300");

export async function requestOtp(formData: FormData) {
  const phone = formData.get("phone") as string;
  if (!phone) return { error: "Phone number is required." };

  try {
    const pb = await getAdminPb();
    
    // Find or create user
    let user;
    try {
      user = await pb.collection('users').getFirstListItem(`phone="${phone}"`);
    } catch (e) {
      // Create user if not found
      const tempPw = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '1!';
      user = await pb.collection('users').create({
        phone,
        name: `User ${phone.slice(-4)}`,
        role: 'customer',
        password: tempPw,
        passwordConfirm: tempPw,
      });
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + OTP_EXPIRY_SECONDS);

    await pb.collection('users').update(user.id, {
      otp_code: MOCK_OTP,
      otp_expires_at: expiresAt.toISOString(),
    });

    await mockNotifier.send({
      type: 'otp_sent',
      customerId: user.id,
      channel: 'mock_sms',
      payload: { otp: MOCK_OTP, expiry: expiresAt.toISOString() }
    });

    return { success: true, phone };
  } catch (error: any) {
    console.error("[AUTH ERROR]", error);
    return { error: error.message || "Failed to request OTP" };
  }
}

export async function verifyOtp(formData: FormData) {
  const phone = formData.get("phone") as string;
  const otp = formData.get("otp") as string;
  
  if (!phone || !otp) return { error: "Phone and OTP are required." };

  try {
    const pb = await getAdminPb();
    const user = await pb.collection('users').getFirstListItem(`phone="${phone}"`);

    if (user.otp_code !== otp) {
      return { error: "Invalid OTP code." };
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return { error: "OTP has expired." };
    }

    // Since we are mocking passwordless OTP and PocketBase doesn't natively support passwordless out of the box without email,
    // we'll "log them in" by generating an auth token via the admin API or by temporarily setting a known password
    // A better approach for demo: Just generate a token manually or authenticate via password.
    // For this demo, let's reset their password temporarily to log them in, then clear OTP.
    
    const tempPassword = Math.random().toString(36).slice(-12);
    await pb.collection('users').update(user.id, {
      password: tempPassword,
      passwordConfirm: tempPassword,
      is_phone_verified: true,
      otp_code: null,
      otp_expires_at: null,
    });

    // Authenticate to get a token
    const authData = await pb.collection('users').authWithPassword(phone, tempPassword);

    // Set cookie
    cookies().set('pb_auth', pb.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return { success: true };
  } catch (error: any) {
    console.error("[VERIFY ERROR]", error);
    return { error: error.message || "Verification failed." };
  }
}
