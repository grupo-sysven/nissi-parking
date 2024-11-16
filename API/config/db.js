const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const pool = new Pool({ 
    user: dbUser, 
    host: dbHost, 
    database: dbName, 
    password: dbPassword, 
    port: dbPort,
}); 

module.exports = pool;