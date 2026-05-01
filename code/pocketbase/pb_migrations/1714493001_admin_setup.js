/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    const dao = new Dao(db);
    const superusers = dao.findCollectionByNameOrId("_superusers");
    const record = new Record(superusers);
    record.set("email", "admin@99cattle.farm");
    record.setPassword("password123456");
    return dao.saveRecord(record);
}, (db) => {
    const dao = new Dao(db);
    try {
        const record = dao.findFirstRecordByData("_superusers", "email", "admin@99cattle.farm");
        return dao.deleteRecord(record);
    } catch (e) {
        return null;
    }
});
