import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ваш кошик порожній</h2>
          <p className="text-gray-600 mb-8">
            Додайте товари до кошика, щоб продовжити покупки
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Перейти до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Кошик</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const displayPrice = item.product.discountPrice || item.product.price;
              const mainImage = item.product.images?.find((img) => img.isMain);

              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {mainImage ? (
                        <img
                          src={mainImage.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          👞
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Розмір: {item.size}</p>

                      {item.customization && (
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Індивідуальне замовлення:</p>
                          {item.customization.material && (
                            <p>• Матеріал: {item.customization.material}</p>
                          )}
                          {item.customization.color && (
                            <p className="flex items-center">
                              • Колір:{' '}
                              <span
                                className="inline-block w-4 h-4 rounded-full ml-2 border"
                                style={{ backgroundColor: item.customization.color }}
                              />
                            </p>
                          )}
                          {item.customization.sole && <p>• Підошва: {item.customization.sole}</p>}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                Math.max(1, item.quantity - 1),
                                item.customization
                              )
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                                item.customization
                              )
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-primary-600">
                            {(displayPrice * item.quantity).toFixed(2)} ₴
                          </span>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.size, item.customization)
                            }
                            className="text-red-600 hover:text-red-700"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Підсумок замовлення</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Товарів:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Вартість:</span>
                  <span>{getTotalPrice().toFixed(2)} ₴</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Разом:</span>
                    <span className="text-primary-600">{getTotalPrice().toFixed(2)} ₴</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Оформити замовлення
              </button>

              <Link
                to="/catalog"
                className="block text-center mt-4 text-primary-600 hover:text-primary-700"
              >
                Продовжити покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
