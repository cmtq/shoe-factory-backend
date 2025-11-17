import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Header = () => {
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">
              👞 Фабрика Взуття
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Головна
            </Link>
            <Link to="/catalog" className="text-gray-700 hover:text-primary-600 transition">
              Каталог
            </Link>
            <Link to="/custom" className="text-gray-700 hover:text-primary-600 transition">
              Конструктор
            </Link>
            <Link to="/manager" className="text-gray-700 hover:text-primary-600 transition">
              Панель менеджера
            </Link>
          </nav>

          <Link
            to="/cart"
            className="relative flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Кошик</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
