import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './Order';
import Product from './Product';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  size: number;
  quantity: number;
  price: number;
  customization?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'customization' | 'createdAt' | 'updatedAt'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public productName!: string;
  public size!: number;
  public quantity!: number;
  public price!: number;
  public customization?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    customization: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    timestamps: true,
  }
);

// Associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

export default OrderItem;
