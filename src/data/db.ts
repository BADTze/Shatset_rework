import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '192.168.131.147',
  port: parseInt('3311', 10),
  user: 'app_development',
  password: 'OTSuk@eng123',
  database: 'satset',
});

export default db;
