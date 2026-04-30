migrate((db) => {
    const dao = new Dao(db);

    const admin = new Admin();
    admin.email = "admin@99cattle.farm";
    admin.setPassword("password123456");

    return dao.saveAdmin(admin);
}, (db) => {
    const dao = new Dao(db);
    try {
        const admin = dao.findAdminByEmail("admin@99cattle.farm");
        return dao.deleteAdmin(admin);
    } catch (e) {
        return null;
    }
});
