import connectDB, { mongoose } from '../config/database';

const runMigrations = async () => {
  try {
    console.log('🔄 Запуск міграцій...');

    await connectDB();
    console.log('✅ Підключено до бази даних');

    // MongoDB doesn't require schema migrations like SQL databases
    // Indexes are created automatically when models are loaded
    console.log('✅ Міграції виконано успішно (MongoDB не потребує міграцій схеми)');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при виконанні міграцій:', error);
    process.exit(1);
  }
};

runMigrations();
