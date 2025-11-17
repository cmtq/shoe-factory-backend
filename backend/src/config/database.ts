import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'shoefactory-maindb-xnqknj',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASSWORD || 'jomlhltwodv03ccx',
  database: process.env.DB_NAME || 'shoe_factory',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
