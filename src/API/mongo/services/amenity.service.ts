import { Amenity } from '../models';
import { IAmenity } from '../interfaces/mongodb.interfaces';
import { ServiceResponse, PaginationOptions, PaginatedResponse, AssociationFilter } from '../../common/interfaces/services.interfaces';
import { Types } from 'mongoose';
import { amenityProjection } from '../interfaces/projections.interfaces';

export class MongoAmenityService {

  async getAllAmenities(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IAmenity>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const amenities = await Amenity.find({}, amenityProjection)
        .skip(skip)
        .limit(limit);

      const total = await Amenity.countDocuments();

      return {
        success: true,
        data: {
          items: amenities,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getAmenityById(id: string): Promise<ServiceResponse<IAmenity>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid amenity ID',
        };
      }

      const amenity = await Amenity.findById(id, amenityProjection);
      
      if (!amenity) {
        return {
          success: false,
          error: 'Amenity not found',
        };
      }

      return {
        success: true,
        data: amenity,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createAmenity(data: Partial<IAmenity>): Promise<ServiceResponse<IAmenity>> {
    try {
      const newAmenity = new Amenity(data);
      await newAmenity.save();

      const amenity = await Amenity.findById(newAmenity.id, amenityProjection);

      return {
        success: true,
        data: amenity as IAmenity,
        message: 'Amenity created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateAmenity(id: string, data: Partial<IAmenity>): Promise<ServiceResponse<IAmenity>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid amenity ID',
        };
      }

      const updatedAmenity = await Amenity.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      if (!updatedAmenity) {
        return {
          success: false,
          error: 'Amendity not found',
        };
      }

      const amenity = await Amenity.findById(updatedAmenity.id, amenityProjection);

      return {
        success: true,
        data: amenity as IAmenity,
        message: 'Amendity updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteAmenity(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid amenity ID',
        };
      }

      const deletedAmenity = await Amenity.findByIdAndDelete(id);

      if (!deletedAmenity) {
        return {
          success: false,
          error: 'Amenity not found',
        };
      }

      return {
        success: true,
        message: 'Amenity deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getAmenitiesByAssociation(filter: AssociationFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IAmenity>>> {
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

      const amenities = await Amenity.find({ associationId }, amenityProjection)
        .skip(skip)
        .limit(limit);

      const total = await Amenity.countDocuments({ associationId });

      return {
        success: true,
        data: {
          items: amenities,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }
}

export default new MongoAmenityService();