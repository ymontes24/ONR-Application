import { Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  names: string;
  lastNames: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AssociationAttributes {
  id: number;
  name: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UnitAttributes {
  id: number;
  name: string;
  association_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserUnitAttributes {
  id: number;
  user_id: number;
  unit_id: number;
  role: 'owner' | 'resident';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAssociationAttributes {
  id: number;
  user_id: number;
  association_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
export interface AssociationCreationAttributes extends Optional<AssociationAttributes, 'id'> {}
export interface UnitCreationAttributes extends Optional<UnitAttributes, 'id'> {}
export interface UserUnitCreationAttributes extends Optional<UserUnitAttributes, 'id'> {}
export interface UserAssociationCreationAttributes extends Optional<UserAssociationAttributes, 'id'> {}