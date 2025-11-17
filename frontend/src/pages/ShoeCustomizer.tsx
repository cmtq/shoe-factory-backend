import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/api';
import { useCart } from '../hooks/useCart';
import type { Product, CustomizationOptions } from '../types';

const ShoeCustomizer = () => {
  const [customizableProducts, setCustomizableProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({});
  const { addToCart } = useCart();

  useEffect(() => {
    loadCustomizableProducts();
  }, []);

  const loadCustomizableProducts = async () => {
    try {
      const response = await productAPI.getAll({ isCustomizable: true });
      setCustomizableProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading customizable products:', error);
    }
  };

  const materials = [
    { value: 'leather', label: 'Шкіра', color: '#8B4513' },
    { value: 'nubuck', label: 'Нубук', color: '#D2691E' },
    { value: 'synthetic', label: 'Шкірозамінник', color: '#696969' },
    { value: 'fur', label: 'Хутро', color: '#FFE4B5' },
    { value: 'fleece', label: 'Байка', color: '#F5DEB3' },
  ];

  const colors = [
    { name: 'Чорний', value: '#000000' },
    { name: 'Коричневий', value: '#8B4513' },
    { name: 'Бежевий', value: '#F5F5DC' },
    { name: 'Червоний', value: '#DC143C' },
    { name: 'Синій', value: '#4169E1' },
    { name: 'Білий', value: '#FFFFFF' },
  ];

  const soles = [
    'Гумова підошва',
    'ТПУ підошва',
    'Шкіряна підошва',
    'Поліуретанова підошва',
  ];

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('Оберіть модель взуття');
      return;
    }

    if (!selectedSize) {
      toast.error('Оберіть розмір');
      return;
    }

    if (!customization.material || !customization.color || !customization.sole) {
      toast.error('Налаштуйте всі опції');
      return;
    }

    addToCart({
      product: selectedProduct,
      size: selectedSize,
      quantity: 1,
      customization,
    });

    toast.success('Індивідуальне взуття додано до кошика!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Конструктор взуття</h1>
          <p className="text-gray-600 mb-8">
            Створіть унікальне взуття за своїм смаком
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Попередній перегляд</h2>

              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {selectedProduct ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">👞</div>
                    <p className="font-semibold text-lg">{selectedProduct.name}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">Оберіть модель</p>
                )}
              </div>

              {selectedProduct && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Модель:</span>
                    <span className="font-semibold">{selectedProduct.name}</span>
                  </div>
                  {customization.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Матеріал:</span>
                      <span className="font-semibold">
                        {materials.find((m) => m.value === customization.material)?.label}
                      </span>
                    </div>
                  )}
                  {customization.color && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Колір:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: customization.color }}
                        />
                      </div>
                    </div>
                  )}
                  {customization.sole && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Підошва:</span>
                      <span className="font-semibold">{customization.sole}</span>
                    </div>
                  )}
                  {selectedSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Розмір:</span>
                      <span className="font-semibold">{selectedSize}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Ціна:</span>
                      <span className="font-bold text-primary-600">
                        {selectedProduct.price.toFixed(2)} ₴
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Panel */}
            <div className="space-y-6">
              {/* Product Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">1. Оберіть модель</h3>
                <div className="grid grid-cols-2 gap-4">
                  {customizableProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 border-2 rounded-lg transition ${
                        selectedProduct?.id === product.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.price.toFixed(2)} ₴
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">2. Оберіть матеріал</h3>
                <div className="grid grid-cols-2 gap-3">
                  {materials.map((material) => (
                    <button
                      key={material.value}
                      onClick={() =>
                        setCustomization({ ...customization, material: material.value as any })
                      }
                      className={`p-3 border-2 rounded-lg transition ${
                        customization.material === material.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: material.color }}
                      />
                      <p className="text-sm font-medium">{material.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">3. Оберіть колір</h3>
                <div className="grid grid-cols-3 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCustomization({ ...customization, color: color.value })}
                      className={`p-3 border-2 rounded-lg transition ${
                        customization.color === color.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div
                        className="w-full h-12 rounded border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <p className="text-xs font-medium mt-2">{color.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sole Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">4. Оберіть підошву</h3>
                <div className="space-y-2">
                  {soles.map((sole) => (
                    <label key={sole} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="sole"
                        checked={customization.sole === sole}
                        onChange={() => setCustomization({ ...customization, sole })}
                        className="mr-3"
                      />
                      <span>{sole}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {selectedProduct && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">5. Оберіть розмір</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {selectedProduct.inventory
                      ?.filter((inv) => inv.quantity - inv.reservedQuantity > 0)
                      .map((inv) => (
                        <button
                          key={inv.size}
                          onClick={() => setSelectedSize(inv.size)}
                          className={`px-4 py-2 border rounded-md transition ${
                            selectedSize === inv.size
                              ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                              : 'border-gray-300 hover:border-primary-400'
                          }`}
                        >
                          {inv.size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition"
              >
                Додати до кошика
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeCustomizer;
