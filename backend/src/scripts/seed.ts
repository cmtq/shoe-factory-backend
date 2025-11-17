import connectDB, { mongoose } from '../config/database';
import Category from '../models/Category';
import Product from '../models/Product';
import ProductImage from '../models/ProductImage';
import Inventory from '../models/Inventory';

const seedData = async () => {
  try {
    console.log('🌱 Початок заповнення бази даних...');
    console.log('═══════════════════════════════════════════════════════════════');

    // Connect to database
    console.log('\n📡 Підключення до бази даних...');
    await connectDB();

    // Clear existing data
    console.log('\n🗑️  Видалення старих даних...');
    await Promise.all([
      Inventory.deleteMany({}),
      ProductImage.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('✅ Старі дані видалено');

    // Create categories
    console.log('\n📁 Створення категорій...');
    const categoriesData = [
      {
        name: 'Чоловіче взуття',
        slug: 'choloviche-vzuttya',
        description: 'Якісне взуття для чоловіків',
        season: 'all-season',
        isActive: true,
      },
      {
        name: 'Жіноче взуття',
        slug: 'zhinoche-vzuttya',
        description: 'Стильне взуття для жінок',
        season: 'all-season',
        isActive: true,
      },
      {
        name: 'Літнє взуття',
        slug: 'litnie-vzuttya',
        description: 'Легке та зручне літнє взуття',
        season: 'summer',
        isActive: true,
      },
      {
        name: 'Зимове взуття',
        slug: 'zymove-vzuttya',
        description: 'Тепле зимове взуття',
        season: 'winter',
        isActive: true,
      },
      {
        name: 'Дитяче взуття',
        slug: 'dytyache-vzuttya',
        description: 'Зручне взуття для дітей',
        season: 'all-season',
        isActive: true,
      },
    ];

    console.log(`   Дані для вставки: ${categoriesData.length} категорій`);
    const categories = await Category.insertMany(categoriesData);
    console.log('✅ Створено категорії');
    console.log(`   Результат: ${categories.length} записів`);
    categories.forEach((cat, idx) => {
      console.log(`   ${idx + 1}. ID: ${cat._id} | Назва: ${cat.name} | Slug: ${cat.slug}`);
    });

    // Verify categories in DB
    const categoryCount = await Category.countDocuments();
    console.log(`   🔍 Перевірка в БД: знайдено ${categoryCount} категорій`);

    // Create products
    console.log('\n👟 Створення товарів...');
    const productsData = [
      // Чоловіче взуття
      {
        categoryId: categories[0]._id,
        name: 'Класичні чоловічі туфлі',
        slug: 'klasychni-cholovichi-tufli',
        description: 'Елегантні туфлі з натуральної шкіри для офісу та урочистих подій',
        price: 2500,
        discountPrice: 2200,
        sku: 'MT-001',
        isActive: true,
        isCustomizable: true,
      },
      {
        categoryId: categories[0]._id,
        name: 'Чоловічі кросівки',
        slug: 'cholovichi-krosivky',
        description: 'Зручні спортивні кросівки для активного способу життя',
        price: 1800,
        sku: 'MS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[0]._id,
        name: 'Чоловічі черевики',
        slug: 'cholovichi-cherevyky',
        description: 'Теплі зимові черевики з натуральним хутром',
        price: 3200,
        discountPrice: 2800,
        sku: 'MB-001',
        isActive: true,
        isCustomizable: true,
      },

      // Жіноче взуття
      {
        categoryId: categories[1]._id,
        name: 'Жіночі туфлі на підборах',
        slug: 'zhinochi-tufli-na-pidborakh',
        description: 'Елегантні туфлі на високих підборах',
        price: 2200,
        sku: 'WH-001',
        isActive: true,
        isCustomizable: true,
      },
      {
        categoryId: categories[1]._id,
        name: 'Жіночі балетки',
        slug: 'zhinochi-baletky',
        description: 'Зручні балетки для повсякденного носіння',
        price: 1500,
        discountPrice: 1200,
        sku: 'WF-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[1]._id,
        name: 'Жіночі чоботи',
        slug: 'zhinochi-choboty',
        description: 'Стильні зимові чоботи',
        price: 3500,
        sku: 'WB-001',
        isActive: true,
        isCustomizable: true,
      },

      // Літнє взуття
      {
        categoryId: categories[2]._id,
        name: 'Сандалі',
        slug: 'sandali',
        description: 'Літні сандалі для жаркої погоди',
        price: 1200,
        sku: 'SS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[2]._id,
        name: 'В\'єтнамки',
        slug: 'vyetnamky',
        description: 'Зручні в\'єтнамки для пляжу',
        price: 500,
        discountPrice: 400,
        sku: 'SF-001',
        isActive: true,
        isCustomizable: false,
      },

      // Зимове взуття
      {
        categoryId: categories[3]._id,
        name: 'Уггі',
        slug: 'uggi',
        description: 'Теплі зимові уггі з овчини',
        price: 2800,
        sku: 'WU-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[3]._id,
        name: 'Зимові кросівки',
        slug: 'zymovi-krosivky',
        description: 'Утеплені кросівки для зими',
        price: 2400,
        discountPrice: 2100,
        sku: 'WS-001',
        isActive: true,
        isCustomizable: false,
      },

      // Дитяче взуття
      {
        categoryId: categories[4]._id,
        name: 'Дитячі кросівки',
        slug: 'dytyachi-krosivky',
        description: 'Зручні кросівки для активних дітей',
        price: 1200,
        sku: 'KS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[4]._id,
        name: 'Дитячі черевики',
        slug: 'dytyachi-cherevyky',
        description: 'Теплі черевики для дітей',
        price: 1800,
        discountPrice: 1500,
        sku: 'KB-001',
        isActive: true,
        isCustomizable: false,
      },
    ];

    console.log(`   Дані для вставки: ${productsData.length} товарів`);
    productsData.forEach((p, idx) => {
      console.log(`   ${idx + 1}. CategoryID: ${p.categoryId} | SKU: ${p.sku} | Назва: ${p.name} | Ціна: ${p.price}`);
    });

    const products = await Product.insertMany(productsData);
    console.log('✅ Створено товари');
    console.log(`   Результат: ${products.length} записів`);
    products.forEach((prod, idx) => {
      console.log(`   ${idx + 1}. ID: ${prod._id} | SKU: ${prod.sku} | Назва: ${prod.name}`);
    });

    // Verify products in DB
    const productCount = await Product.countDocuments();
    console.log(`   🔍 Перевірка в БД: знайдено ${productCount} товарів`);

    // Create product images (demo URLs)
    console.log('\n📸 Створення фото товарів...');
    console.log(`   Створення по 3 фото для кожного з ${products.length} товарів...`);

    const imagePromises = products.map((product, index) => {
      console.log(`   Товар ${index + 1}/${products.length}: ID ${product._id} - ${product.name}`);
      return ProductImage.insertMany([
        {
          productId: product._id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+1`,
          altText: `${product.name} - вид 1`,
          sortOrder: 0,
          isMain: true,
        },
        {
          productId: product._id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+2`,
          altText: `${product.name} - вид 2`,
          sortOrder: 1,
          isMain: false,
        },
        {
          productId: product._id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+3`,
          altText: `${product.name} - вид 3`,
          sortOrder: 2,
          isMain: false,
        },
      ]);
    });

    const imageResults = await Promise.all(imagePromises);
    console.log('✅ Додано фото товарів');
    console.log(`   Результат: ${imageResults.length} товарів, по 3 фото = ${imageResults.length * 3} фото`);

    // Verify images in DB
    const imageCount = await ProductImage.countDocuments();
    console.log(`   🔍 Перевірка в БД: знайдено ${imageCount} фото`);

    // Create inventory
    console.log('\n📦 Створення записів наявності товарів...');
    const inventoryData = [];
    const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

    console.log(`   Розміри: ${sizes.join(', ')}`);
    console.log(`   Товарів: ${products.length}`);
    console.log(`   Очікується записів: ${products.length * sizes.length}`);

    for (const product of products) {
      for (const size of sizes) {
        const quantity = Math.floor(Math.random() * 20) + 5;
        inventoryData.push({
          productId: product._id,
          size,
          quantity,
          reservedQuantity: 0,
        });
      }
      console.log(`   Товар ID ${product._id} (${product.name}): додано ${sizes.length} розмірів`);
    }

    console.log(`   Підготовлено ${inventoryData.length} записів для вставки`);
    const inventoryResult = await Inventory.insertMany(inventoryData);
    console.log('✅ Додано наявність товарів');
    console.log(`   Результат: ${inventoryResult.length} записів`);

    // Verify inventory in DB
    const inventoryCount = await Inventory.countDocuments();
    console.log(`   🔍 Перевірка в БД: знайдено ${inventoryCount} записів наявності`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 База даних успішно заповнена!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   Категорій: ${categories.length} (в БД: ${categoryCount})`);
    console.log(`   Товарів: ${products.length} (в БД: ${productCount})`);
    console.log(`   Фото: ${products.length * 3} (в БД: ${imageCount})`);
    console.log(`   Записів наявності: ${inventoryData.length} (в БД: ${inventoryCount})`);

    // Final verification - show actual data from DB
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🔍 ФІНАЛЬНА ПЕРЕВІРКА - Реальні дані з БД:');
    console.log('═══════════════════════════════════════════════════════════════');

    const allCategories = await Category.find().lean();
    console.log('\n📁 Категорії в БД:');
    if (allCategories.length === 0) {
      console.log('   ⚠️  ПУСТО! Категорій немає в БД!');
    } else {
      allCategories.forEach((cat: any) => {
        console.log(`   - ID: ${cat._id}, Назва: ${cat.name}, Slug: ${cat.slug}`);
      });
    }

    const allProducts = await Product.find().limit(5).lean();
    console.log('\n👟 Товари в БД (перші 5):');
    if (allProducts.length === 0) {
      console.log('   ⚠️  ПУСТО! Товарів немає в БД!');
    } else {
      allProducts.forEach((prod: any) => {
        console.log(`   - ID: ${prod._id}, SKU: ${prod.sku}, Назва: ${prod.name}, CategoryID: ${prod.categoryId}`);
      });
    }

    const allImages = await ProductImage.find().limit(5).lean();
    console.log('\n📸 Фото в БД (перші 5):');
    if (allImages.length === 0) {
      console.log('   ⚠️  ПУСТО! Фото немає в БД!');
    } else {
      allImages.forEach((img: any) => {
        console.log(`   - ID: ${img._id}, ProductID: ${img.productId}, Main: ${img.isMain}, URL: ${img.imageUrl.substring(0, 50)}...`);
      });
    }

    const allInventory = await Inventory.find().limit(10).lean();
    console.log('\n📦 Наявність в БД (перші 10):');
    if (allInventory.length === 0) {
      console.log('   ⚠️  ПУСТО! Записів наявності немає в БД!');
    } else {
      allInventory.forEach((inv: any) => {
        console.log(`   - ID: ${inv._id}, ProductID: ${inv.productId}, Розмір: ${inv.size}, Кількість: ${inv.quantity}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    // Disconnect from database
    await mongoose.connection.close();
    console.log('✅ З\'єднання з БД закрито');

    process.exit(0);
  } catch (error) {
    console.error('\n═══════════════════════════════════════════════════════════════');
    console.error('❌ ПОМИЛКА при заповненні бази даних!');
    console.error('═══════════════════════════════════════════════════════════════');
    console.error('Тип помилки:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Повідомлення:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('\nСтек викликів:');
      console.error(error.stack);
    }
    console.error('\nПовний об\'єкт помилки:');
    console.error(JSON.stringify(error, null, 2));
    console.error('═══════════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
};

seedData();
