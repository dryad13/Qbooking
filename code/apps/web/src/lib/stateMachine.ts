export type BookingStatus = 
  | 'draft' 
  | 'awaiting_kyc' 
  | 'kyc_rejected' 
  | 'awaiting_payment' 
  | 'payment_review' 
  | 'payment_rejected' 
  | 'confirmed' 
  | 'fulfillment_assigned' 
  | 'slaughtered' 
  | 'out_for_delivery' 
  | 'ready_for_pickup' 
  | 'fulfilled' 
  | 'cancelled';

export type Role = 'customer' | 'admin' | 'kyc_verifier' | 'payment_verifier';

const TRANSITIONS: Record<BookingStatus, Partial<Record<BookingStatus, Role[]>>> = {
  draft: {
    awaiting_kyc: ['customer', 'admin']
  },
  awaiting_kyc: {
    awaiting_payment: ['admin', 'kyc_verifier'],
    kyc_rejected: ['admin', 'kyc_verifier']
  },
  kyc_rejected: {
    awaiting_kyc: ['customer', 'admin']
  },
  awaiting_payment: {
    payment_review: ['customer', 'admin']
  },
  payment_review: {
    confirmed: ['admin', 'payment_verifier'],
    payment_rejected: ['admin', 'payment_verifier']
  },
  payment_rejected: {
    payment_review: ['customer', 'admin']
  },
  confirmed: {
    fulfillment_assigned: ['admin'],
    cancelled: ['admin']
  },
  fulfillment_assigned: {
    slaughtered: ['admin']
  },
  slaughtered: {
    out_for_delivery: ['admin'],
    ready_for_pickup: ['admin']
  },
  out_for_delivery: { fulfilled: ['admin'] },
  ready_for_pickup: { fulfilled: ['admin'] },
  fulfilled: {},
  cancelled: {}
};

export function assertTransitionAllowed(currentStatus: BookingStatus | null, nextStatus: BookingStatus, userRole: Role) {
  if (currentStatus === null) {
    if (nextStatus === 'draft') return true;
    throw new Error(`Invalid initial state: ${nextStatus}. Must start at draft.`);
  }

  const allowedTransitions = TRANSITIONS[currentStatus];
  if (!allowedTransitions) {
    throw new Error(`State ${currentStatus} has no defined transitions.`);
  }

  const allowedRoles = allowedTransitions[nextStatus];
  if (!allowedRoles) {
    throw new Error(`Transition from ${currentStatus} to ${nextStatus} is not allowed.`);
  }

  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Role ${userRole} is not authorized to transition from ${currentStatus} to ${nextStatus}.`);
  }

  return true;
}
