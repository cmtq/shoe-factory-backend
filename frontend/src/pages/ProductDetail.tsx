import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import toast from 'react-hot-toast';
import { productAPI, inventoryAPI } from '../services/api';
import { useCart } from '../hooks/useCart';
import type { Product, Inventory } from '../types';
import 'react-image-gallery/styles/css/image-gallery.css';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const response = await productAPI.getBySlug(slug);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Помилка при завантаженні товару');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast.error('Будь ласка, оберіть розмір');
      return;
    }

    const inventory = product.inventory?.find((inv) => inv.size === selectedSize);
    if (!inventory || (inventory.quantity - inventory.reservedQuantity) < quantity) {
      toast.error('Недостатня кількість на складі');
      return;
    }

    addToCart({
      product,
      size: selectedSize,
      quantity,
    });

    toast.success('Товар додано до кошика!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Товар не знайдено</p>
      </div>
    );
  }

  const images = product.images
    ?.sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      original: img.imageUrl,
      thumbnail: img.imageUrl,
      description: img.altText || product.name,
    })) || [];

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const availableSizes =
    product.inventory
      ?.filter((inv) => inv.quantity - inv.reservedQuantity > 0)
      .sort((a, b) => a.size - b.size) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              {images.length > 0 ? (
                <ImageGallery
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                />
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Немає фото</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              {product.category && (
                <p className="text-gray-600 mb-4">Категорія: {product.category.name}</p>
              )}

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  {displayPrice.toFixed(2)} ₴
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      {product.price.toFixed(2)} ₴
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                      -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Опис</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Оберіть розмір</h3>
                {availableSizes.length > 0 ? (
                  <div className="grid grid-cols-6 gap-2">
                    {availableSizes.map((inv) => {
                      const available = inv.quantity - inv.reservedQuantity;
                      return (
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
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-red-600">Немає в наявності</p>
                )}
              </div>

              {selectedSize && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Кількість</h3>
                  <input
                    type="number"
                    min="1"
                    max={
                      product.inventory?.find((inv) => inv.size === selectedSize)?.quantity || 1
                    }
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={availableSizes.length === 0}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {availableSizes.length === 0 ? 'Немає в наявності' : 'Додати до кошика'}
              </button>

              {product.isCustomizable && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  💡 Цей товар доступний у конструкторі взуття
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
