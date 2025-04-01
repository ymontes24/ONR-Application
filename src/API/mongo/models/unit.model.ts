import mongoose, { Schema } from 'mongoose';
import { IUnit } from '../interfaces/mongodb.interfaces';

const unitSchema = new Schema<IUnit>(
  {
    name: {
      type: String,
      required: true,
    },
    associationId: {
      type: Schema.Types.ObjectId,
      ref: 'Association',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUnit>('Unit', unitSchema);