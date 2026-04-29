/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fbe7upak",
    "name": "phone",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9fzycygq",
    "name": "role",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "customer",
        "super_admin",
        "sales_agent",
        "kyc_verifier",
        "payment_verifier",
        "fulfillment_staff",
        "delivery_manager"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hvwbdm8f",
    "name": "is_phone_verified",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qa7de4bq",
    "name": "otp_code",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "blpz7irv",
    "name": "otp_expires_at",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("fbe7upak")

  // remove
  collection.schema.removeField("9fzycygq")

  // remove
  collection.schema.removeField("hvwbdm8f")

  // remove
  collection.schema.removeField("qa7de4bq")

  // remove
  collection.schema.removeField("blpz7irv")

  return dao.saveCollection(collection)
})
