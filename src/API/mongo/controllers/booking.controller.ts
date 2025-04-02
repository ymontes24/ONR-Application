import { Request, Response } from 'express';
import bookingService from '../services/booking.service';
import { IBooking } from '../interfaces/mongodb.interfaces';

export class BookingController {
  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await bookingService.getAllBookings({ page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await bookingService.getBookingById(id);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<IBooking> = req.body;
      const response = await bookingService.createBooking(data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<IBooking> = req.body;
      const response = await bookingService.updateBooking(id, data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await bookingService.deleteBooking(id);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async getBookingsByAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { associationId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await bookingService.getBookingsByAssociation({ associationId }, { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }

  async getBookingsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await bookingService.getBookingsByUser(userId, { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      });
    }
  }
}

export default new BookingController();