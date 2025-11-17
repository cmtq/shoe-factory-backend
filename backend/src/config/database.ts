import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'shoe-factory-mysql-l6j7r9',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASSWORD || 'kmy357lm68k0dgy7',
  database: process.env.DB_NAME || 'mysql',
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? (sql) => {
    console.log('🔵 SQL:', sql);
  } : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
