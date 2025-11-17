import sequelize from '../config/database';

const runMigrations = async () => {
  try {
    console.log('🔄 Запуск міграцій...');

    await sequelize.authenticate();
    console.log('✅ Підключено до бази даних');

    await sequelize.sync({ alter: true });
    console.log('✅ Міграції виконано успішно');

    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при виконанні міграцій:', error);
    process.exit(1);
  }
};

runMigrations();
