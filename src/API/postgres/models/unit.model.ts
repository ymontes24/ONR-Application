import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/postgresql';
import Association from './association.model';
import { UnitAttributes, UnitCreationAttributes } from '../interfaces/postgres.interfaces';

class Unit extends Model<UnitAttributes, UnitCreationAttributes> implements UnitAttributes {
  public id!: number;
  public name!: string;
  public association_id!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Unit.init(
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
    association_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'associations',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Unit',
    tableName: 'units',
    timestamps: true,
    underscored: true,
  }
);


Unit.belongsTo(Association, { foreignKey: 'association_id', as: 'association' });
Association.hasMany(Unit, { foreignKey: 'association_id', as: 'units' });

export default Unit;