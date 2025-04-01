import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/postgresql';
import { AssociationAttributes, AssociationCreationAttributes } from '../interfaces/postgres.interfaces';

class Association extends Model<AssociationAttributes, AssociationCreationAttributes> implements AssociationAttributes {
  public id!: number;
  public name: string;
  public address: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Association.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Association',
    tableName: 'associations',
    timestamps: true,
    underscored: true,
  }
);

export default Association;