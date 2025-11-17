import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Category from './Category';

interface ProductAttributes {
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
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'discountPrice' | 'sku' | 'isActive' | 'isCustomizable' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public price!: number;
  public discountPrice?: number;
  public sku?: string;
  public isActive!: boolean;
  public isCustomizable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isCustomizable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

export default Product;
