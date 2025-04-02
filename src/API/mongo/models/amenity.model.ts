import mongoose, { Schema } from 'mongoose';
import moment from 'moment';
import { IAmenity } from '../interfaces/mongodb.interfaces';

const amenitySchema = new Schema<IAmenity>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    bookable: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      validate: {
        validator: function(value: string) {
          return moment(value, 'HH:mm', true).isValid();
        },
        message: 'Invalid opening time format. Please use the format "HH:MM".',
      },
    },
    closingTime: {
      type: String,
      validate: {
        validator: function(value: string) {
          return moment(value, 'HH:mm', true).isValid();
        },
        message: 'Invalid closing time format. Please use the format "HH:MM".',
      },
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

amenitySchema.index({ associationId: 1 });

export default mongoose.model<IAmenity>('Amenity', amenitySchema);