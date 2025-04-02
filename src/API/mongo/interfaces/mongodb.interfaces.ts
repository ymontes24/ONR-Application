import { Document, Types } from 'mongoose';

export interface IUserUnit {
  unitId: Types.ObjectId;
  role: UserRoles;
}

export enum UserRoles {
    Owner = 'owner',
    Resident = 'resident',
}

export interface IUser extends Document {
  names: string;
  lastNames: string;
  email: string;
  password: string;
  associations: Types.ObjectId[];
  units: IUserUnit[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssociation extends Document {
  name: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnit extends Document {
  name: string;
  associationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAmenity extends Document {
  name: string;
  description?: string;
  bookable: boolean;
  openingTime?: string;
  closingTime?: string;
  associationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking extends Document {
  date: Date;
  timeStart: string;
  timeEnd: string;
  userId: Types.ObjectId;
  amenityId: Types.ObjectId;
  groupingId: Types.ObjectId; // referencia a la asociación
  createdAt: Date;
  updatedAt: Date;
}