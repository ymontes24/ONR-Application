import { Request, Response } from 'express';
import amenityService from '../services/amenity.service';
import { IAmenity } from '../interfaces/mongodb.interfaces';

export class AmenityController {
  async getAllAmenities(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await amenityService.getAllAmenities({ page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
 
  async getAmenityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await amenityService.getAmenityById(id);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async createAmenity(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<IAmenity> = req.body;
      const response = await amenityService.createAmenity(data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateAmenity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<IAmenity> = req.body;
      const response = await amenityService.updateAmenity(id, data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async deleteAmenity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await amenityService.deleteAmenity(id);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getAmenitiesByAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { associationId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await amenityService.getAmenitiesByAssociation({ associationId }, { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}

export default new AmenityController();