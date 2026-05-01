/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const superusers = app.findCollectionByNameOrId("_superusers");
    const record = new Record(superusers);
    record.set("email", "admin@99cattle.farm");
    record.setPassword("password123456");
    return app.save(record);
}, (app) => {
    try {
        const record = app.findFirstRecordByData("_superusers", "email", "admin@99cattle.farm");
        return app.delete(record);
    } catch (e) {
        return null;
    }
});
