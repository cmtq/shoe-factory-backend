import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  isActive: boolean;
  isCustomizable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCustomizable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
