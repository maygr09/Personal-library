import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'library',
  password: 'MaySQLP25',
  port: 5432,
});

export default pool;