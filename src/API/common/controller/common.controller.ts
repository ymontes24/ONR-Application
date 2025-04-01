import e, { Request, Response } from 'express';
import combinedService from '../service/common.service';
import { userEmailSchema, userIdSchema } from '../../postgres/schemas/user.schemas';
import { bookingSchema } from '../schemas/booking.schema';

export class CombinedController {

  async getUsersWithUnits(req: Request, res: Response): Promise<void> {
    try {
      const response = await combinedService.getUsersWithUnits();
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async getUserWithUnitsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = isNaN(Number(id)) ? id : parseInt(id);
      
      const response = await combinedService.getUserWithUnitsById(parsedId);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async getUserWithUnitsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      
      const { error } = userEmailSchema.validate(email);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid email',
        });
        return;
      }
      
      const response = await combinedService.getUserWithUnitsByEmail(email);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async bookAmenityForPostgresUser(req: Request, res: Response): Promise<void> {
    try {
      const { pgUserId, amenityId } = req.params;
      const bookingData = req.body;

      const { error: bookingError } = bookingSchema.validate(bookingData);

      const { error } = userIdSchema.validate(pgUserId);

      if (error || bookingError) {
        res.status(400).json({
          success: false,
          error: error ? 'Invalid PostgreSQL user ID' : bookingError?.message,
        });
        return;
      }
      
      if (!pgUserId || !amenityId) {
        res.status(400).json({
          success: false,
          error: 'PostgreSQL user ID and amenity ID required',
        });
        return;
      }
      
      const response = await combinedService.bookAmenityForPostgresUser(
        parseInt(pgUserId),
        amenityId,
        bookingData
      );
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }
}

export default new CombinedController();