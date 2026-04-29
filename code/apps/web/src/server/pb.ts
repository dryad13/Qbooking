import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const PB_URL = process.env.POCKETBASE_INTERNAL_URL || 'http://127.0.0.1:8090';

// For server actions requiring admin privileges (like generating OTPs)
export async function getAdminPb() {
  const pb = new PocketBase(PB_URL);
  // Auto Cancellation: In a real app, you might want to disable autoCancellation or handle it per request
  pb.autoCancellation(false);
  
  await pb.admins.authWithPassword('admin@example.com', 'password123');
  return pb;
}

// For fetching data as the authenticated user (from cookies)
export async function getUserPb() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  const cookieStore = cookies();
  const pbAuth = cookieStore.get('pb_auth');

  if (pbAuth) {
    pb.authStore.loadFromCookie(pbAuth.value);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh();
    }
  } catch (_) {
    pb.authStore.clear();
  }

  return pb;
}
