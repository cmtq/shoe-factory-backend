import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

interface InventoryAttributes {
  id: number;
  productId: number;
  size: number;
  quantity: number;
  reservedQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'reservedQuantity' | 'createdAt' | 'updatedAt'> {}

class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  public id!: number;
  public productId!: number;
  public size!: number;
  public quantity!: number;
  public reservedQuantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    size: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reservedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'inventory',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['productId', 'size'],
      },
    ],
  }
);

// Associations
Inventory.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Inventory, { foreignKey: 'productId', as: 'inventory' });

export default Inventory;
