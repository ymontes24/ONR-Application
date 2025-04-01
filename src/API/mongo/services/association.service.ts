import { Association } from '../models';
import { IAssociation } from '../interfaces/mongodb.interfaces';
import { ServiceResponse, PaginationOptions, PaginatedResponse } from '../../common/interfaces/services.interfaces';
import { Types } from 'mongoose';


export class MongoAssociationService {

  async getAllAssociations(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IAssociation>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const associations = await Association.find()
        .skip(skip)
        .limit(limit);

      const total = await Association.countDocuments();

      return {
        success: true,
        data: {
          items: associations,
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

  async getAssociationById(id: string): Promise<ServiceResponse<IAssociation>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'association ID is invalid',
        };
      }

      const association = await Association.findById(id);
      
      if (!association) {
        return {
          success: false,
          error: 'Association not found',
        };
      }

      return {
        success: true,
        data: association,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createAssociation(data: Partial<IAssociation>): Promise<ServiceResponse<IAssociation>> {
    try {
      const newAssociation = new Association(data);
      await newAssociation.save();

      return {
        success: true,
        data: newAssociation,
        message: 'Association created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateAssociation(id: string, data: Partial<IAssociation>): Promise<ServiceResponse<IAssociation>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Association ID is invalid',
        };
      }

      const updatedAssociation = await Association.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      if (!updatedAssociation) {
        return {
          success: false,
          error: 'Association not found',
        };
      }

      return {
        success: true,
        data: updatedAssociation,
        message: 'Association updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteAssociation(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'Association ID is invalid',
        };
      }

      const deletedAssociation = await Association.findByIdAndDelete(id);

      if (!deletedAssociation) {
        return {
          success: false,
          error: 'Association not found',
        };
      }

      return {
        success: true,
        message: 'Association deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }
}

export default new MongoAssociationService();