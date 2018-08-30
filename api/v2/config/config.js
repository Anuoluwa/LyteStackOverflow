import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,

});

// let connectionString;

// if (process.NODE_ENV) {
//   if (process.NODE_ENV.trim() === 'test') connectionString = process.env.ELEPHANT_TEST;

//   if (process.NODE_ENV.trim() === 'production') connectionString = process.env.ELEPHANTSQL_URL;
// }
// const pool = new Pool({
//   connectionString,
// });

export default pool;
