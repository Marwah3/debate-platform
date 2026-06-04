import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Username default Laragon/XAMPP biasanya root
  password: '',      // Password default Laragon/XAMPP biasanya kosong
  database: 'db_platform_debat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});