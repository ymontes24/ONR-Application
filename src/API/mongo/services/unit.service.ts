import { Unit } from '../models';
import { IUnit } from '../interfaces/mongodb.interfaces';
import { ServiceResponse, PaginationOptions, PaginatedResponse, AssociationFilter } from '../../common/interfaces/services.interfaces';
import { Types, ObjectId } from 'mongoose';

export class MongoUnitService {

  async getAllUnits(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IUnit>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const units = await Unit.find({}, { id: '$_id', name: 1, associationId: 1 , _id: 0 })
        .skip(skip)
        .limit(limit);

      const total = await Unit.countDocuments();

      return {
        success: true,
        data: {
          items: units,
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

  async getUnitById(id: string): Promise<ServiceResponse<IUnit>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid unit ID',
        };
      }

      const unit = await Unit.findById(id, { id: '$_id', name: 1, associationId: 1, _id: 0 });
      
      if (!unit) {
        return {
          success: false,
          error: 'Unit not found',
        };
      }

      return {
        success: true,
        data: unit,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createUnit(data: Partial<IUnit>): Promise<ServiceResponse<IUnit>> {
    try {
      const newUnit = new Unit(data);
      await newUnit.save();

      const createdUnit = await Unit.findById(
        newUnit._id,
        { id: '$_id', name: 1, associationId: 1, _id: 0 }
      );

      return {
        success: true,
        data: createdUnit as IUnit,
        message: 'Unit created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateUnit(id: string, data: Partial<IUnit>): Promise<ServiceResponse<IUnit>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid unit ID',
        };
      }

      const updatedUnit = await Unit.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true },
      );

      if (!updatedUnit) {
        return {
          success: false,
          error: 'Unit not found',
        };
      }

      const unit = await Unit.findById(id, { id: '$_id', name: 1, associationId: 1, _id: 0 });      

      return {
        success: true,
        data: unit as IUnit,
        message: 'Unit updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteUnit(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Invalid unit ID',
        };
      }

      const deletedUnit = await Unit.findByIdAndDelete(id);

      if (!deletedUnit) {
        return {
          success: false,
          error: 'Unit not found',
        };
      }

      return {
        success: true,
        message: 'Unit deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUnitsByAssociation(filter: AssociationFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IUnit>>> {
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

      const units = await Unit.find({ associationId }, { id: '$_id', name: 1, associationId: 1, _id: 0 })
        .skip(skip)
        .limit(limit);

      const total = await Unit.countDocuments({ associationId });

      return {
        success: true,
        data: {
          items: units,
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

export default new MongoUnitService();