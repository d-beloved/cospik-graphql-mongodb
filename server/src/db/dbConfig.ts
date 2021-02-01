import dotenv from 'dotenv';

dotenv.config();
export const config = {
  development: {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  test: {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.TEST_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
}

const env = process.env.NODE_ENV || 'development';

export const connectionString = config[env];
