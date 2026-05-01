import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const PB_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL || process.env.POCKETBASE_INTERNAL_URL || 'http://127.0.0.1:8090';

export async function getAdminPb() {
  const adminEmail = process.env.PB_ADMIN_EMAIL;
  const adminPassword = process.env.PB_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set in .env.local');
  }

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
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
