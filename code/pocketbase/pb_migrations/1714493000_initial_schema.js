migrate((app) => {
  const collections = [
    {
      "id": "_pb_users_auth_",
      "name": "users",
      "type": "auth",
      "system": false,
      "fields": [
        { "id": "field_u_phone", "name": "phone", "type": "text", "required": true, "presentable": false, "unique": true, "min": null, "max": null, "pattern": "" },
        { "id": "field_u_otp_code", "name": "otp_code", "type": "text", "required": false, "presentable": false, "unique": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_u_otp_exp", "name": "otp_expires_at", "type": "date", "required": false, "presentable": false, "unique": false, "min": "", "max": "" },
        { "id": "field_u_user_role", "name": "role", "type": "select", "required": false, "presentable": false, "unique": false, "maxSelect": 1, "values": ["customer", "admin"] },
        { "id": "field_u_is_verified", "name": "is_phone_verified", "type": "bool", "required": false, "presentable": false, "unique": false }
      ],
      "indexes": [],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id"
    },
    {
      "id": "kyc_coll_888",
      "name": "kyc_documents",
      "type": "base",
      "system": false,
      "fields": [
        { "id": "field_k_booking", "name": "booking_id", "type": "relation", "required": true, "presentable": false, "collectionId": "bookings_coll", "cascadeDelete": true, "minSelect": null, "maxSelect": 1 },
        { "id": "field_k_customer", "name": "customer_id", "type": "relation", "required": true, "presentable": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_k_id_number", "name": "id_number", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_k_id_type", "name": "id_type", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_k_doc_front", "name": "doc_front", "type": "file", "required": false, "presentable": false, "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false },
        { "id": "field_k_doc_back", "name": "doc_back", "type": "file", "required": false, "presentable": false, "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false },
        { "id": "field_k_status", "name": "status", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "viewRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.role = 'admin'",
      "deleteRule": "@request.auth.role = 'admin'"
    },
    {
      "id": "pay_coll_888",
      "name": "payments",
      "type": "base",
      "system": false,
      "fields": [
        { "id": "field_p_booking", "name": "booking_id", "type": "relation", "required": true, "presentable": false, "collectionId": "bookings_coll", "cascadeDelete": true, "minSelect": null, "maxSelect": 1 },
        { "id": "field_p_customer", "name": "customer_id", "type": "relation", "required": true, "presentable": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_p_amount", "name": "amount", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_p_method", "name": "method", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_p_proof", "name": "proof_file", "type": "file", "required": false, "presentable": false, "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false },
        { "id": "field_p_status", "name": "status", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "viewRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.role = 'admin'",
      "deleteRule": "@request.auth.role = 'admin'"
    },
    {
      "id": "bookings_coll",
      "name": "bookings",
      "type": "base",
      "system": false,
      "fields": [
        { "id": "field_b_reference", "name": "booking_reference", "type": "text", "required": true, "unique": true, "min": null, "max": null, "pattern": "" },
        { "id": "field_b_customer", "name": "customer_id", "type": "relation", "required": true, "presentable": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_b_created_by", "name": "created_by", "type": "relation", "required": false, "presentable": false, "collectionId": "_pb_users_auth_", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_b_package", "name": "package_type", "type": "select", "required": true, "presentable": false, "maxSelect": 1, "values": ["normal", "premium"] },
        { "id": "field_b_status", "name": "status", "type": "select", "required": true, "presentable": false, "maxSelect": 1, "values": ["draft", "awaiting_kyc", "kyc_rejected", "awaiting_payment", "payment_review", "payment_rejected", "confirmed", "fulfillment_assigned", "slaughtered", "out_for_delivery", "ready_for_pickup", "fulfilled", "cancelled"] },
        { "id": "field_b_total_shares", "name": "total_shares", "type": "number", "required": false, "presentable": false, "min": 1, "max": 7, "noDecimal": false },
        { "id": "field_b_subtotal", "name": "subtotal", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_b_addons", "name": "addons_total", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_b_grand_total", "name": "grand_total", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_b_cutting", "name": "cutting_requested", "type": "bool", "required": false, "presentable": false },
        { "id": "field_b_delivery", "name": "delivery_requested", "type": "bool", "required": false, "presentable": false },
        { "id": "field_b_cur_kyc", "name": "current_kyc_id", "type": "relation", "required": false, "presentable": false, "collectionId": "kyc_coll_888", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_b_cur_pay", "name": "current_payment_id", "type": "relation", "required": false, "presentable": false, "collectionId": "pay_coll_888", "cascadeDelete": false, "minSelect": null, "maxSelect": 1 },
        { "id": "field_b_kyc_resub", "name": "kyc_resubmission_count", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_b_pay_resub", "name": "payment_resubmission_count", "type": "number", "required": false, "presentable": false, "min": null, "max": null, "noDecimal": false },
        { "id": "field_b_slot", "name": "slaughter_slot", "type": "date", "required": false, "presentable": false, "min": "", "max": "" },
        { "id": "field_b_notes", "name": "notes", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "viewRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.id = customer_id || @request.auth.role = 'admin'",
      "deleteRule": "@request.auth.role = 'admin'"
    },
    {
      "id": "audit_logs_coll_888",
      "name": "audit_logs",
      "type": "base",
      "system": false,
      "fields": [
        { "id": "field_l_actor", "name": "actor_id", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_l_ent_type", "name": "entity_type", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_l_ent_id", "name": "entity_id", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_l_action", "name": "action", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_l_before", "name": "before", "type": "json", "required": false, "presentable": false, "maxSize": 2000000 },
        { "id": "field_l_after", "name": "after", "type": "json", "required": false, "presentable": false, "maxSize": 2000000 },
        { "id": "field_l_timestamp", "name": "timestamp", "type": "date", "required": false, "presentable": false, "min": "", "max": "" }
      ],
      "indexes": [],
      "listRule": "@request.auth.role = 'admin'",
      "viewRule": "@request.auth.role = 'admin'",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null
    },
    {
      "id": "notif_log_coll_888",
      "name": "notifications_log",
      "type": "base",
      "system": false,
      "fields": [
        { "id": "field_n_type", "name": "type", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_n_booking", "name": "booking_id", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_n_customer", "name": "customer_id", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_n_channel", "name": "channel", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_n_payload", "name": "payload", "type": "json", "required": false, "presentable": false, "maxSize": 2000000 },
        { "id": "field_n_status", "name": "status", "type": "text", "required": false, "presentable": false, "min": null, "max": null, "pattern": "" },
        { "id": "field_n_sent_at", "name": "sent_at", "type": "date", "required": false, "presentable": false, "min": "", "max": "" }
      ],
      "indexes": [],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null
    }
  ];

  return app.importCollections(collections, false);
}, (app) => {
  // down migration
});
