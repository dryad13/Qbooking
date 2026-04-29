import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function seed() {
  console.log('Authenticating...');
  await pb.admins.authWithPassword('admin@example.com', 'password123');
  console.log('Authenticated as Admin.');

  const usersColl = await pb.collections.getOne('users');
  const usersId = usersColl.id;

  const collections = await pb.collections.getFullList();
  const names = collections.map(c => c.name);

  // 1. Bookings (already created, but let's get its ID)
  let bookingsId = collections.find(c => c.name === 'bookings')?.id;
  if (!bookingsId) {
    const c = await pb.collections.create({
      name: 'bookings', type: 'base',
      schema: [
        { name: 'booking_reference', type: 'text', required: true },
        { name: 'customer_id', type: 'relation', required: true, options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'created_by', type: 'relation', required: false, options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'package_type', type: 'select', required: true, options: { values: ['normal', 'premium'], maxSelect: 1 } },
        { name: 'status', type: 'select', required: true, options: { values: ['draft', 'awaiting_kyc', 'kyc_rejected', 'awaiting_payment', 'payment_review', 'payment_rejected', 'confirmed', 'fulfillment_assigned', 'slaughtered', 'out_for_delivery', 'ready_for_pickup', 'fulfilled', 'cancelled'], maxSelect: 1 } },
        { name: 'total_shares', type: 'number', required: true, options: { min: 1, max: 7 } },
        { name: 'subtotal', type: 'number' },
        { name: 'addons_total', type: 'number' },
        { name: 'grand_total', type: 'number' },
        { name: 'cutting_requested', type: 'bool' },
        { name: 'delivery_requested', type: 'bool' },
        { name: 'kyc_resubmission_count', type: 'number' },
        { name: 'payment_resubmission_count', type: 'number' },
        { name: 'slaughter_slot', type: 'date' },
        { name: 'notes', type: 'text' },
      ]
    });
    bookingsId = c.id;
  }

  // 2. booking_shares
  if (!names.includes('booking_shares')) {
    await pb.collections.create({
      name: 'booking_shares', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', required: true, options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'share_count', type: 'number' },
        { name: 'package_type', type: 'select', options: { values: ['normal', 'premium'], maxSelect: 1 } },
        { name: 'price_per_share', type: 'number' },
        { name: 'line_total', type: 'number' },
        { name: 'addons', type: 'json' },
      ]
    });
  }

  // 3. kyc_documents
  let kycId = collections.find(c => c.name === 'kyc_documents')?.id;
  if (!kycId) {
    const c = await pb.collections.create({
      name: 'kyc_documents', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', required: true, options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'customer_id', type: 'relation', required: true, options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'id_number', type: 'text', required: true },
        { name: 'id_type', type: 'select', options: { values: ['cnic', 'nid', 'passport'], maxSelect: 1 } },
        { name: 'doc_front', type: 'file', required: true, options: { maxSelect: 1 } },
        { name: 'doc_back', type: 'file', required: true, options: { maxSelect: 1 } },
        { name: 'status', type: 'select', options: { values: ['pending', 'approved', 'rejected'], maxSelect: 1 } },
        { name: 'rejection_reason', type: 'text' },
        { name: 'reviewed_by', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'reviewed_at', type: 'date' },
        { name: 'submission_number', type: 'number' },
      ]
    });
    kycId = c.id;
  }

  // 4. payments
  let paymentsId = collections.find(c => c.name === 'payments')?.id;
  if (!paymentsId) {
    const c = await pb.collections.create({
      name: 'payments', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', required: true, options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'customer_id', type: 'relation', required: true, options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'amount', type: 'number', required: true },
        { name: 'method', type: 'select', options: { values: ['proof_upload'], maxSelect: 1 } },
        { name: 'proof_file', type: 'file', required: true, options: { maxSelect: 1 } },
        { name: 'transaction_ref', type: 'text' },
        { name: 'status', type: 'select', options: { values: ['pending', 'verified', 'rejected'], maxSelect: 1 } },
        { name: 'rejection_reason', type: 'text' },
        { name: 'reviewed_by', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'reviewed_at', type: 'date' },
        { name: 'submission_number', type: 'number' },
      ]
    });
    paymentsId = c.id;
  }

  // Update bookings with self relations
  try {
    const bk = await pb.collections.getOne('bookings');
    let needsUpdate = false;
    if (!bk.schema.find((s:any) => s.name === 'current_kyc_id')) {
      bk.schema.push({ name: 'current_kyc_id', type: 'relation', options: { collectionId: kycId, maxSelect: 1 } } as any);
      needsUpdate = true;
    }
    if (!bk.schema.find((s:any) => s.name === 'current_payment_id')) {
      bk.schema.push({ name: 'current_payment_id', type: 'relation', options: { collectionId: paymentsId, maxSelect: 1 } } as any);
      needsUpdate = true;
    }
    if (needsUpdate) await pb.collections.update('bookings', bk);
  } catch (e) {}

  // 5. invoices
  if (!names.includes('invoices')) {
    await pb.collections.create({
      name: 'invoices', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', required: true, options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'invoice_number', type: 'text' },
        { name: 'pdf_file', type: 'file', options: { maxSelect: 1 } },
        { name: 'issued_at', type: 'date' },
        { name: 'line_items', type: 'json' },
        { name: 'total_amount', type: 'number' },
      ]
    });
  }

  // 6. inventory_cows
  if (!names.includes('inventory_cows')) {
    await pb.collections.create({
      name: 'inventory_cows', type: 'base',
      schema: [
        { name: 'batch_ref', type: 'text' },
        { name: 'cow_ref', type: 'text' },
        { name: 'total_shares', type: 'number' },
        { name: 'remaining_shares', type: 'number' },
        { name: 'slaughter_slot', type: 'date' },
        { name: 'location', type: 'text' },
        { name: 'status', type: 'select', options: { values: ['available', 'partially_assigned', 'fully_assigned', 'slaughtered'], maxSelect: 1 } },
      ]
    });
  }

  // 7. delivery_orders
  if (!names.includes('delivery_orders')) {
    await pb.collections.create({
      name: 'delivery_orders', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', required: true, options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'mode', type: 'select', options: { values: ['delivery', 'pickup'], maxSelect: 1 } },
        { name: 'pickup_location', type: 'text' },
        { name: 'delivery_address', type: 'text' },
        { name: 'scheduled_slot', type: 'date' },
        { name: 'status', type: 'select', options: { values: ['pending', 'assigned', 'dispatched', 'delivered', 'collected'], maxSelect: 1 } },
        { name: 'assigned_to', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'handoff_confirmed_at', type: 'date' },
        { name: 'notes', type: 'text' },
      ]
    });
  }

  // 8. audit_logs
  if (!names.includes('audit_logs')) {
    await pb.collections.create({
      name: 'audit_logs', type: 'base',
      schema: [
        { name: 'actor_id', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'entity_type', type: 'select', options: { values: ['booking', 'kyc_documents', 'payments', 'delivery_orders'], maxSelect: 1 } },
        { name: 'entity_id', type: 'text' },
        { name: 'action', type: 'text' },
        { name: 'before', type: 'json' },
        { name: 'after', type: 'json' },
        { name: 'timestamp', type: 'date' },
      ]
    });
  }

  // 9. notifications_log
  if (!names.includes('notifications_log')) {
    await pb.collections.create({
      name: 'notifications_log', type: 'base',
      schema: [
        { name: 'booking_id', type: 'relation', options: { collectionId: bookingsId, maxSelect: 1 } },
        { name: 'customer_id', type: 'relation', options: { collectionId: usersId, maxSelect: 1 } },
        { name: 'type', type: 'select', options: { values: ['otp_sent', 'kyc_approved', 'kyc_rejected', 'payment_verified', 'payment_rejected', 'booking_confirmed', 'slip_ready', 'kyc_resubmitted', 'payment_resubmitted'], maxSelect: 1 } },
        { name: 'channel', type: 'select', options: { values: ['mock_whatsapp', 'mock_email', 'mock_sms'], maxSelect: 1 } },
        { name: 'payload', type: 'json' },
        { name: 'status', type: 'select', options: { values: ['sent', 'failed'], maxSelect: 1 } },
        { name: 'sent_at', type: 'date' },
      ]
    });
  }

  console.log('Successfully created all collections!');
}

seed().catch(console.error);
