import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Кошик порожній');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          size: item.size,
          quantity: item.quantity,
          customization: item.customization,
        })),
      };

      const response = await orderAPI.create(orderData);

      toast.success('Замовлення успішно оформлено!');
      clearCart();
      navigate('/order-success', { state: { order: response.data } });
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.error || 'Помилка при оформленні замовлення');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Оформлення замовлення</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Контактні дані</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ім'я та прізвище *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    placeholder="+380"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адреса доставки
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примітки до замовлення
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Обробка...' : 'Підтвердити замовлення'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => {
                  const displayPrice = item.product.discountPrice || item.product.price;
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} ({item.size}) x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(displayPrice * item.quantity).toFixed(2)} ₴
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span>Разом:</span>
                  <span className="text-primary-600">{getTotalPrice().toFixed(2)} ₴</span>
                </div>
                <p className="text-sm text-gray-600">
                  Наш менеджер зв'яжеться з вами для підтвердження замовлення
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
