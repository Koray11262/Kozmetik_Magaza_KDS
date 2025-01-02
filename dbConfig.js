const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kdsuser',
    password: process.env.DB_PASSWORD || 'kds123',
    database: process.env.DB_NAME || 'kds',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    connectTimeout: 10000, // 10 saniye
    waitForConnections: true,
    connectionLimit: 10
};

module.exports = dbConfig; 