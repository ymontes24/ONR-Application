import mongoose, { Schema } from 'mongoose';
import { IAssociation } from '../interfaces/mongodb.interfaces';

const associationSchema = new Schema<IAssociation>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAssociation>('Association', associationSchema);