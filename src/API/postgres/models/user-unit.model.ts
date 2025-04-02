import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/postgresql';
import User from './user.model';
import Unit from './unit.model';
import { UserUnitAttributes, UserUnitCreationAttributes } from '../interfaces/postgres.interfaces';

class UserUnit extends Model<UserUnitAttributes, UserUnitCreationAttributes> implements UserUnitAttributes {
  public id!: number;
  public user_id!: number;
  public unit_id!: number;
  public role!: 'owner' | 'resident';
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserUnit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'units',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('owner', 'resident'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserUnit',
    tableName: 'user_units',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'unit_id'],
      },
    ],
  }
);

User.belongsToMany(Unit, { through: UserUnit, foreignKey: 'user_id', otherKey: 'unit_id', as: 'units', onDelete: 'CASCADE' });
Unit.belongsToMany(User, { through: UserUnit, foreignKey: 'unit_id', otherKey: 'user_id', as: 'users', onDelete: 'CASCADE' });

export default UserUnit;