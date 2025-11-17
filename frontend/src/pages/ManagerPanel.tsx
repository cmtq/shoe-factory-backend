import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { inventoryAPI, productAPI, orderAPI } from '../services/api';
import type { Inventory, Product, Order } from '../types';

const ManagerPanel = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const [invResponse, prodResponse] = await Promise.all([
          inventoryAPI.getAll(),
          productAPI.getAll(),
        ]);
        setInventory(invResponse.data);
        setProducts(prodResponse.data.products || []);
      } else {
        const response = await orderAPI.getAll();
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Помилка при завантаженні даних');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async (productId: number, size: number, quantity: number) => {
    try {
      await inventoryAPI.update(productId, size, quantity);
      toast.success('Наявність оновлено');
      loadData();
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Помилка при оновленні наявності');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Статус замовлення оновлено');
      loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Помилка при оновленні статусу');
    }
  };

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name || 'Невідомий товар';
  };

  const groupedInventory = inventory.reduce((acc, inv) => {
    const productName = getProductName(inv.productId);
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(inv);
    return acc;
  }, {} as Record<string, Inventory[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Панель менеджера</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'inventory'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Управління наявністю
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Замовлення
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : activeTab === 'inventory' ? (
          /* Inventory Management */
          <div className="space-y-6">
            {Object.entries(groupedInventory).map(([productName, items]) => (
              <div key={productName} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">{productName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((inv) => (
                    <div key={inv.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Розмір {inv.size}</span>
                        <span
                          className={`text-sm ${
                            inv.quantity - inv.reservedQuantity <= 5
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {inv.quantity - inv.reservedQuantity} доступно
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Всього: {inv.quantity} | Заброньовано: {inv.reservedQuantity}
                      </div>
                      <input
                        type="number"
                        min="0"
                        defaultValue={inv.quantity}
                        onBlur={(e) => {
                          const newQty = parseInt(e.target.value);
                          if (newQty !== inv.quantity) {
                            handleUpdateInventory(inv.productId, inv.size, newQty);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Orders Management */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Замовлення #{order.orderNumber}</h3>
                    <p className="text-gray-600">{order.customerName} - {order.customerPhone}</p>
                    <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {order.totalAmount.toFixed(2)} ₴
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="pending">Очікує</option>
                      <option value="confirmed">Підтверджено</option>
                      <option value="processing">Обробляється</option>
                      <option value="shipped">Відправлено</option>
                      <option value="delivered">Доставлено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </div>
                </div>

                {order.shippingAddress && (
                  <p className="text-sm text-gray-600 mb-3">
                    Адреса: {order.shippingAddress}
                  </p>
                )}

                {order.items && order.items.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2">Товари:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.productName} (розмір {item.size}) x{item.quantity}
                          </span>
                          <span>{item.price.toFixed(2)} ₴</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.notes && (
                  <p className="text-sm text-gray-600 mt-3 italic">
                    Примітки: {order.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPanel;
