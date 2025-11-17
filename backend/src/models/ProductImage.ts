import { Schema, model, Document, Types } from 'mongoose';

export interface IProductImage extends Document {
  productId: Types.ObjectId;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isMain: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProductImage = model<IProductImage>('ProductImage', productImageSchema);

export default ProductImage;
