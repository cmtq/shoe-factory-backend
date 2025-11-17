import { Schema, model, Document, Types } from 'mongoose';

export interface IInventory extends Document {
  productId: Types.ObjectId;
  size: number;
  quantity: number;
  reservedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique compound index for productId and size
inventorySchema.index({ productId: 1, size: 1 }, { unique: true });

const Inventory = model<IInventory>('Inventory', inventorySchema);

export default Inventory;
