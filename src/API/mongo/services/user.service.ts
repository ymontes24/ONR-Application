import { User } from '../models';
import { IUser } from '../interfaces/mongodb.interfaces';
import { ServiceResponse, PaginationOptions, PaginatedResponse, AssociationFilter, UnitFilter } from '../../common/interfaces/services.interfaces';
import { Types } from 'mongoose';

export class MongoUserService {
  async getAllUsers(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IUser>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments();

      return {
        success: true,
        data: {
          items: users,
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

  async getUserById(id: string): Promise<ServiceResponse<IUser>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'User ID is invalid',
        };
      }

      const user = await User.findById(id).select('-password');
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUserByEmail(email: string): Promise<ServiceResponse<IUser>> {
    try{
      const user = await User.findOne({ email }).select('-password');

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createUser(userData: Partial<IUser>): Promise<ServiceResponse<IUser>> {
    try {
      const newUser = new User(userData);
      await newUser.save();

      const userResponse = newUser.toObject();

      return {
        success: true,
        data: userResponse as IUser,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<ServiceResponse<IUser>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'User ID is invalid',
        };
      }

      if (userData.password) {
        delete userData.password;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteUser(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: 'User ID is invalid',
        };
      }

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUsersByAssociation(filter: AssociationFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IUser>>> {
    try {
      const { associationId } = filter;
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      if (!Types.ObjectId.isValid(associationId as string)) {
        return {
          success: false,
          error: 'Association ID is invalid',
        };
      }

      const users = await User.find({ associations: associationId })
        .select('-password')
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments({ associations: associationId });

      return {
        success: true,
        data: {
          items: users,
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

  async getUsersByUnit(filter: UnitFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<IUser>>> {
    try {
      const { unitId } = filter;
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      if (!Types.ObjectId.isValid(unitId as string)) {
        return {
          success: false,
          error: 'Unit ID is invalid',
        };
      }

      const users = await User.find({ units: { $elemMatch: { unitId } }})
        .select('-password')
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments({ units: { $elemMatch: { unitId } }});

      return {
        success: true,
        data: {
          items: users,
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

export default new MongoUserService();