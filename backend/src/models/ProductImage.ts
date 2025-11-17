import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

interface ProductImageAttributes {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isMain: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 'id' | 'altText' | 'sortOrder' | 'isMain' | 'createdAt' | 'updatedAt'> {}

class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes> implements ProductImageAttributes {
  public id!: number;
  public productId!: number;
  public imageUrl!: string;
  public altText?: string;
  public sortOrder!: number;
  public isMain!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductImage.init(
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'product_images',
    timestamps: true,
  }
);

// Associations
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });

export default ProductImage;
