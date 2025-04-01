import mongoose, { Schema } from 'mongoose';
import { IUser, UserRoles } from '../interfaces/mongodb.interfaces';

const userSchema = new Schema<IUser>(
  {
    names: {
      type: String,
      required: true,
    },
    lastNames: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    associations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Association',
      },
    ],
    units: [
      {
        unitId: {
          type: Schema.Types.ObjectId,
          ref: 'Unit',
        },
        role: {
          type: String,
          enum: [UserRoles.Owner, UserRoles.Resident],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', userSchema);