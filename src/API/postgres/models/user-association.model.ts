import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/postgresql';
import User from './user.model';
import Association from './association.model';
import { UserAssociationAttributes, UserAssociationCreationAttributes } from '../interfaces/postgres.interfaces';

class UserAssociation extends Model<UserAssociationAttributes, UserAssociationCreationAttributes> implements UserAssociationAttributes {
  public id!: number;
  public user_id!: number;
  public association_id!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserAssociation.init(
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
    modelName: 'UserAssociation',
    tableName: 'user_associations',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'association_id'],
      },
    ],
  }
);

User.belongsToMany(Association, { through: UserAssociation, foreignKey: 'user_id', otherKey: 'association_id', as: 'associations', onDelete: 'CASCADE' });
Association.belongsToMany(User, { through: UserAssociation, foreignKey: 'association_id', otherKey: 'user_id', as: 'users', onDelete: 'CASCADE' });

export default UserAssociation;