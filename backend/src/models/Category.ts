import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  season?: 'summer' | 'winter' | 'spring' | 'autumn' | 'all-season';
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'season' | 'image' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public season?: 'summer' | 'winter' | 'spring' | 'autumn' | 'all-season';
  public image?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    season: {
      type: DataTypes.ENUM('summer', 'winter', 'spring', 'autumn', 'all-season'),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;
