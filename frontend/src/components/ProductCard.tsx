import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const mainImage = product.images?.find((img) => img.isMain) || product.images?.[0];
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  // Check if product has available inventory
  const totalAvailable = product.inventory?.reduce(
    (sum, inv) => sum + (inv.quantity - inv.reservedQuantity),
    0
  ) || 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage.imageUrl}
            alt={mainImage.altText || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </div>
        )}

        {totalAvailable === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-md font-semibold">
              Немає в наявності
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              {displayPrice.toFixed(2)} ₴
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.price.toFixed(2)} ₴
              </span>
            )}
          </div>

          {product.isCustomizable && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              Конструктор
            </span>
          )}
        </div>

        {totalAvailable > 0 && totalAvailable <= 5 && (
          <p className="text-sm text-orange-600 mt-2">
            Залишилось {totalAvailable} шт.
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
