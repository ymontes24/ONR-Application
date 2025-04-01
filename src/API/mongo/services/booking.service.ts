import { Booking, Amenity } from '../models';
import { IBooking } from '../interfaces/mongodb.interfaces';
import { ServiceResponse, PaginationOptions, PaginatedResponse, AssociationFilter } from '../../common/interfaces/services.interfaces';
import { Types } from 'mongoose';
import { bookingProjection } from '../interfaces/projections.interfaces';

export class MongoBookingService {
  async getAllBookings(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IBooking>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({}, bookingProjection)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'names lastNames email')
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');

      const total = await Booking.countDocuments();

      return {
        success: true,
        data: {
          items: bookings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async getBookingById(id: string): Promise<ServiceResponse<IBooking>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid booking ID',
        };
      }

      const booking = await Booking.findById(id, bookingProjection)
        .populate('userId', 'names lastNames email')
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');
      
      if (!booking) {
        return {
          success: false,
          error: 'Booking not found',
        };
      }

      return {
        success: true,
        data: booking,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async createBooking(data: Partial<IBooking>): Promise<ServiceResponse<IBooking>> {
    try {
      if (!data.amenityId || !Types.ObjectId.isValid(data.amenityId as unknown as string)) {
        return {
          success: false,
          error: 'Invalid amenity ID',
        };
      }

      const amenity = await Amenity.find({
        _id: data.amenityId,
        bookable: true,
        associationId: data.groupingId,
        $or: [
          { openingTime: { $lte: data.timeStart }, closingTime: { $gte: data.timeEnd } },
        ],
      });

      if (!amenity.length) {
        return {
          success: false,
          error: 'Amenity not found or not bookable for this time',
        };
      }
      const { date, timeStart, timeEnd, amenityId } = data;
      
      const existingBooking = await Booking.findOne({
        amenityId,
        date,
        $or: [
          { timeStart: { $lte: timeStart }, timeEnd: { $gt: timeStart } },
          { timeStart: { $lt: timeEnd }, timeEnd: { $gte: timeEnd } },
          { timeStart: { $gte: timeStart }, timeEnd: { $lte: timeEnd } },
        ],
      });

      if (existingBooking) {
        return {
          success: false,
          error: 'There is already a booking for this time',
        };
      }

      const newBooking = new Booking(data);
      await newBooking.save();

      const savedBooking = await Booking.findById(newBooking._id, bookingProjection)
        .populate('userId', 'names lastNames email')
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');

      return {
        success: true,
        data: savedBooking as IBooking,
        message: 'Booking created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async updateBooking(id: string, data: Partial<IBooking>): Promise<ServiceResponse<IBooking>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid booking ID',
        };
      }

      if (data.date || data.timeStart || data.timeEnd) {
        const booking = await Booking.findById(id);
        if (!booking) {
          return {
            success: false,
            error: 'Booking not found',
          };
        }

        const newDate = data.date || booking.date;
        const newTimeStart = data.timeStart || booking.timeStart;
        const newTimeEnd = data.timeEnd || booking.timeEnd;
        const amenityId = data.amenityId || booking.amenityId;

        const existingBooking = await Booking.findOne({
          _id: { $ne: id },
          amenityId,
          date: newDate,
          $or: [
            { timeStart: { $lte: newTimeStart }, timeEnd: { $gt: newTimeStart } },
            { timeStart: { $lt: newTimeEnd }, timeEnd: { $gte: newTimeEnd } },
            { timeStart: { $gte: newTimeStart }, timeEnd: { $lte: newTimeEnd } },
          ],
        });

        if (existingBooking) {
          return {
            success: false,
            error: 'There is already a booking for this time',
          };
        }
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      )
        .populate('userId', 'names lastNames email')
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');

      if (!updatedBooking) {
        return {
          success: false,
          error: 'Booking not found',
        };
      }

      const booking = await Booking.findById(id, bookingProjection)

      return {
        success: true,
        data: booking as IBooking,
        message: 'Booking updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async deleteBooking(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid booking ID',
        };
      }

      const deletedBooking = await Booking.findByIdAndDelete(id);

      if (!deletedBooking) {
        return {
          success: false,
          error: 'Booking not found',
        };
      }

      return {
        success: true,
        message: 'Booking deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async getBookingsByAssociation(filter: AssociationFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IBooking>>> {
    try {
      const { associationId } = filter;
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      if (!Types.ObjectId.isValid(associationId as string)) {
        return {
          success: false,
          error: 'Invalid association ID',
        };
      }

      const bookings = await Booking.find({ groupingId: associationId }, bookingProjection)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'names lastNames email')
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');

      const total = await Booking.countDocuments({ groupingId: associationId });

      return {
        success: true,
        data: {
          items: bookings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  async getBookingsByUser(userId: string, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IBooking>>> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return {
          success: false,
          error: 'Invalid user ID',
        };
      }

      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const bookings = await Booking.find({ userId }, bookingProjection)
        .skip(skip)
        .limit(limit)
        .populate('amenityId', 'name openingTime closingTime')
        .populate('groupingId', 'name');

      const total = await Booking.countDocuments({ userId });

      return {
        success: true,
        data: {
          items: bookings,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }
}

export default new MongoBookingService();