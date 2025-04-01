import mongoose, { Schema } from 'mongoose';
import moment from 'moment';
import { IBooking } from '../interfaces/mongodb.interfaces';

const bookingSchema = new Schema<IBooking>(
  {
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value: Date) {
          return moment(value).isSameOrAfter(moment(), 'day');
        },
        message: 'Invalid date. Date must be equal to or greater than today.',
      },
    },
    timeStart: {
      type: String,
      required: true,
      validate: {
        validator: function(value: string) {
          return moment(value, 'HH:mm', true).isValid();
        },
        message: 'Invalid closing time format. Please use the format "HH:MM".',
      },
    },
    timeEnd: {
      type: String,
      required: true,
      validate: {
        validator: function(value: string) {
          return moment(value, 'HH:mm', true).isValid();
        },
        message: 'Invalid closing time format. Please use the format "HH:MM".',
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amenityId: {
      type: Schema.Types.ObjectId,
      ref: 'Amenity',
      required: true,
    },
    groupingId: {
      type: Schema.Types.ObjectId,
      ref: 'Association',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ amenityId: 1 });
bookingSchema.index({ date: 1, amenityId: 1 });
bookingSchema.index({ groupingId: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);