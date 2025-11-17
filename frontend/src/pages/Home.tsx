import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ limit: 4 });
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Фабрика Взуття</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Якісне взуття для всієї родини. Великий вибір моделей на будь-який сезон.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/catalog"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Переглянути каталог
            </Link>
            <Link
              to="/custom"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-900 transition border-2 border-white"
            >
              Створити своє взуття
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Конструктор взуття</h3>
              <p className="text-gray-600">
                Створіть унікальне взуття за своїм дизайном
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Завжди в наявності</h3>
              <p className="text-gray-600">
                Відстежуйте наявність товарів у реальному часі
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Швидка доставка</h3>
              <p className="text-gray-600">
                Зручне оформлення та швидка доставка замовлень
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Популярні товари</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/catalog"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Переглянути всі товари
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Категорії</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/catalog?season=summer"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">☀️</div>
              <h3 className="font-semibold">Літнє взуття</h3>
            </Link>
            <Link
              to="/catalog?season=winter"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">❄️</div>
              <h3 className="font-semibold">Зимове взуття</h3>
            </Link>
            <Link
              to="/catalog?season=spring"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-semibold">Весняне взуття</h3>
            </Link>
            <Link
              to="/catalog?season=autumn"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">🍂</div>
              <h3 className="font-semibold">Осіннє взуття</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
