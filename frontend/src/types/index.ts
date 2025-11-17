export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  season?: 'summer' | 'winter' | 'spring' | 'autumn' | 'all-season';
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  isActive: boolean;
  isCustomizable: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  images?: ProductImage[];
  inventory?: Inventory[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isMain: boolean;
}

export interface Inventory {
  id: number;
  productId: number;
  size: number;
  quantity: number;
  reservedQuantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  size: number;
  quantity: number;
  price: number;
  customization?: CustomizationOptions;
}

export interface CustomizationOptions {
  sole?: string;
  color?: string;
  material?: 'leather' | 'nubuck' | 'synthetic' | 'fur' | 'fleece';
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
  customization?: CustomizationOptions;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
