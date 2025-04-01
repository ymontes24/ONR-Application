import mongoUserService from '../../mongo/services/user.service';
import pgUserService from '../../postgres/services/user.service';
import mongoAmenityService from '../../mongo/services/amenity.service'
import mongoBookingService from '../../mongo/services/booking.service';
import { Types } from 'mongoose';
import { createBooking, ServiceResponse } from '../interfaces/services.interfaces';
import { UserAttributes } from '../../postgres/interfaces/postgres.interfaces';

export class CombinedService {

  async getUsersWithUnits(): Promise<ServiceResponse<any>> {
    try {
      const mongoUsersResponse = await mongoUserService.getAllUsers({ limit: 1000 });
      
      if (!mongoUsersResponse.success) {
        return {
          success: false,
          error: 'Error retrieving users from MongoDB: ' + mongoUsersResponse.error,
        };
      }
      
      const pgUsersResponse = await pgUserService.getAllUsers({ limit: 1000 });
      
      if (!pgUsersResponse.success) {
        return {
          success: false,
          error: 'Error al obtener usuarios de PostgreSQL: ' + pgUsersResponse.error,
        };
      }
      
      const mongoUsers = mongoUsersResponse.data?.items.map((user) => ({
        id: user._id.toString(),
        names: user.names,
        lastNames: user.lastNames,
        email: user.email,
        source: 'mongodb',
        units: user.units.map((unitRef) => ({
          id: unitRef.unitId.toString(),
          role: unitRef.role,
        })),
      }));
      
      const pgUsers = pgUsersResponse.data?.items.map((user: any) => ({
        id: user.id.toString(),
        names: user.names,
        lastNames: user.lastNames,
        email: user.email,
        source: 'postgresql',
        units: user.units?.map((unit: any) => ({
          id: unit.id.toString(),
          role: unit.membership?.role || 'unknown',
        })) || [],
      }));
      
      const combinedUsers = [...(mongoUsers || []), ...(pgUsers || [])];
      
      return {
        success: true,
        data: combinedUsers,
        message: 'Successfully retrieved user and unit data from both databases',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUserWithUnitsById(id: string | number): Promise<ServiceResponse<any>> {
    try {
      let mongoUser = null;
      let pgUser = null;
      
      if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
        const mongoUserResponse = await mongoUserService.getUserById(id);
        if (mongoUserResponse.success && mongoUserResponse.data) {
          const user = mongoUserResponse.data;
          mongoUser = {
            id: user._id.toString(),
            names: user.names,
            lastNames: user.lastNames,
            email: user.email,
            source: 'mongodb',
            units: user.units.map((unitRef) => ({
              id: unitRef.unitId.toString(),
              role: unitRef.role,
            })),
          };
        }
      }
      
      if (typeof id === 'number' || !isNaN(Number(id))) {
        const pgUserResponse = await pgUserService.getUserById(typeof id === 'string' ? parseInt(id) : id);
        if (pgUserResponse.success && pgUserResponse.data) {
          const user = pgUserResponse.data as any;
          pgUser = {
            id: user.id.toString(),
            names: user.names,
            lastNames: user.lastNames,
            email: user.email,
            source: 'postgresql',
            units: user.units?.map((unit: any) => ({
              id: unit.id.toString(),
              role: unit.membership?.role || 'unknown',
            })) || [],
          };
        }
      }
      
      if (!mongoUser && !pgUser) {
        return {
          success: false,
          error: 'User not found in any database',
        };
      }
      

      const result = mongoUser || pgUser;
      
      return {
        success: true,
        data: result,
        message: `User found in the ${result?.source} database`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async getUserWithUnitsByEmail(email: string): Promise<ServiceResponse<any>> {
    try {
      const mongoUserResponse = await mongoUserService.getUserByEmail(email);
      let mongoUser = null;
      
      if (mongoUserResponse.success && mongoUserResponse.data) {
        const user = mongoUserResponse.data;
        mongoUser = {
          id: user._id.toString(),
          names: user.names,
          lastNames: user.lastNames,
          email: user.email,
          source: 'mongodb',
          units: user.units.map((unitRef) => ({
            id: unitRef.unitId.toString(),
            role: unitRef.role,
          })),
        };
      }
      
      const pgUserResponse = await pgUserService.getUserByEmail(email);
      let pgUser = null;
      
      if (pgUserResponse.success && pgUserResponse.data) {
        const user = pgUserResponse.data as any;
        pgUser = {
          id: user.id.toString(),
          names: user.names,
          lastNames: user.lastNames,
          email: user.email,
          source: 'postgresql',
          units: user.units?.map((unit: any) => ({
            id: unit.id.toString(),
            name: unit.name,
            role: unit.membership?.role || 'unknown',
          })) || [],
        };
      }
      
      if (!mongoUser && !pgUser) {
        return {
          success: false,
          error: 'User not found in any database',
        };
      }
      
      if (mongoUser && pgUser) {
        return {
          success: true,
          data: {
            mongodb: mongoUser,
            postgresql: pgUser,
          },
          message: 'User found in both databases',
        };
      }
      
      const result = mongoUser || pgUser;
      
      return {
        success: true,
        data: result,
        message: `User found in the ${result?.source} database`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async bookAmenityForPostgresUser(pgUserId: number, amenityId: string, bookingData: createBooking): Promise<ServiceResponse<any>> {
    try {
      const pgUserResponse = await pgUserService.getUserByIdInternal(pgUserId);
      
      if (!pgUserResponse.success || !pgUserResponse.data) {
        return {
          success: false,
          error: 'User not found in PostgreSQL',
        };
      }
      
      const pgUser = pgUserResponse.data as UserAttributes;
      
      const mongoUserResponse = await mongoUserService.getUserByEmail(pgUser.email);
      let mongoUser = null;
      
      if (mongoUserResponse.success && mongoUserResponse.data) {
        const user = mongoUserResponse.data;
        mongoUser = {
          _id: user._id,
          names: user.names,
          lastNames: user.lastNames,
          email: user.email
        };
      }
      
      if (!mongoUser) {
        const newUserResponse = await mongoUserService.createUser({
          email: pgUser.email,
          names: pgUser.names,
          lastNames: pgUser.lastNames,
          password: pgUser.password,
        });
        
        if (!newUserResponse.success || !newUserResponse.data) {
          return {
            success: false,
            error: 'Error creating user in MongoDB',
          };
        }
        
        mongoUser = newUserResponse.data;
      }

      const amenity = await mongoAmenityService.getAmenityById(amenityId);

      if (!amenity.success || !amenity.data) {
        return {
          success: false,
          error: 'Amenity not found in MongoDB',
        };
      }

      const booking = await mongoBookingService.createBooking({
        userId: mongoUser._id,
        amenityId: new Types.ObjectId(amenityId),
        date: bookingData.date,
        timeStart: bookingData.timeStart,
        timeEnd: bookingData.timeEnd,
        groupingId: amenity.data.associationId,
      });

      if (!booking.success || !booking.data) {
        return {
          success: false,
          error: booking.error || 'Error creating booking in MongoDB',
        };
      }
      
      return {
        success: true,
        message: 'Booking created successfully',
        data: {
          pgUser: {
            id: pgUser.id,
            email: pgUser.email,
          },
          mongoUser: {
            id: mongoUser._id,
            email: mongoUser.email,
          },
          booking: booking.data,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }
}

export default new CombinedService();