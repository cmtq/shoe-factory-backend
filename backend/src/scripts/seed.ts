import sequelize from '../config/database';
import Category from '../models/Category';
import Product from '../models/Product';
import ProductImage from '../models/ProductImage';
import Inventory from '../models/Inventory';

const seedData = async () => {
  try {
    console.log('🌱 Початок заповнення бази даних...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Підключено до бази даних');

    // Sync models
    await sequelize.sync({ force: true });
    console.log('✅ Таблиці створено');

    // Create categories
    const categories = await Category.bulkCreate([
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
    ]);

    console.log('✅ Створено категорії');

    // Create products
    const products = await Product.bulkCreate([
      // Чоловіче взуття
      {
        categoryId: categories[0].id,
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
        categoryId: categories[0].id,
        name: 'Чоловічі кросівки',
        slug: 'cholovichi-krosivky',
        description: 'Зручні спортивні кросівки для активного способу життя',
        price: 1800,
        sku: 'MS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[0].id,
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
        categoryId: categories[1].id,
        name: 'Жіночі туфлі на підборах',
        slug: 'zhinochi-tufli-na-pidborakh',
        description: 'Елегантні туфлі на високих підборах',
        price: 2200,
        sku: 'WH-001',
        isActive: true,
        isCustomizable: true,
      },
      {
        categoryId: categories[1].id,
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
        categoryId: categories[1].id,
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
        categoryId: categories[2].id,
        name: 'Сандалі',
        slug: 'sandali',
        description: 'Літні сандалі для жаркої погоди',
        price: 1200,
        sku: 'SS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[2].id,
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
        categoryId: categories[3].id,
        name: 'Уггі',
        slug: 'uggi',
        description: 'Теплі зимові уггі з овчини',
        price: 2800,
        sku: 'WU-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[3].id,
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
        categoryId: categories[4].id,
        name: 'Дитячі кросівки',
        slug: 'dytyachi-krosivky',
        description: 'Зручні кросівки для активних дітей',
        price: 1200,
        sku: 'KS-001',
        isActive: true,
        isCustomizable: false,
      },
      {
        categoryId: categories[4].id,
        name: 'Дитячі черевики',
        slug: 'dytyachi-cherevyky',
        description: 'Теплі черевики для дітей',
        price: 1800,
        discountPrice: 1500,
        sku: 'KB-001',
        isActive: true,
        isCustomizable: false,
      },
    ]);

    console.log('✅ Створено товари');

    // Create product images (demo URLs)
    const imagePromises = products.map((product, index) => {
      return ProductImage.bulkCreate([
        {
          productId: product.id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+1`,
          altText: `${product.name} - вид 1`,
          sortOrder: 0,
          isMain: true,
        },
        {
          productId: product.id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+2`,
          altText: `${product.name} - вид 2`,
          sortOrder: 1,
          isMain: false,
        },
        {
          productId: product.id,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}+3`,
          altText: `${product.name} - вид 3`,
          sortOrder: 2,
          isMain: false,
        },
      ]);
    });

    await Promise.all(imagePromises);
    console.log('✅ Додано фото товарів');

    // Create inventory
    const inventoryData = [];
    const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

    for (const product of products) {
      for (const size of sizes) {
        inventoryData.push({
          productId: product.id,
          size,
          quantity: Math.floor(Math.random() * 20) + 5, // Random quantity 5-25
          reservedQuantity: 0,
        });
      }
    }

    await Inventory.bulkCreate(inventoryData);
    console.log('✅ Додано наявність товарів');

    console.log('🎉 База даних успішно заповнена!');
    console.log(`   Категорій: ${categories.length}`);
    console.log(`   Товарів: ${products.length}`);
    console.log(`   Фото: ${products.length * 3}`);
    console.log(`   Записів наявності: ${inventoryData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при заповненні бази даних:', error);
    process.exit(1);
  }
};

seedData();
