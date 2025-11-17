import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrderAttributes {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'shippingAddress' | 'status' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public orderNumber!: string;
  public customerName!: string;
  public customerEmail!: string;
  public customerPhone!: string;
  public shippingAddress?: string;
  public totalAmount!: number;
  public status!: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
  }
);

export default Order;
