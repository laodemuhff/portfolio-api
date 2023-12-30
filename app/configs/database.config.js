exports.development = Object.freeze({
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: "mysql",
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
    }
});

exports.staging = Object.freeze({
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: "mysql",
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
    }
});

exports.production = Object.freeze({
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: "mysql",
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
    }
});