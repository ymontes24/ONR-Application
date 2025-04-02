import { Request, Response } from 'express';
import associationService from '../services/association.service';
import { AssociationAttributes } from '../interfaces/postgres.interfaces';
import {
  associationSchema,
  associationIdSchema,
  updateAssociationSchema
} from '../schemas/association.schemas';

export class PostgresAssociationController {
  async getAllAssociations(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await associationService.getAllAssociations({ page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getAssociationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error } = associationIdSchema.validate(id);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const response = await associationService.getAssociationById(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async createAssociation(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<AssociationAttributes> = req.body;
      const { error } = associationSchema.validate(data);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }

      const response = await associationService.createAssociation(data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<AssociationAttributes> = req.body;
      const { error: idError } = associationIdSchema.validate(id);
      const { error: dataError } = updateAssociationSchema.validate(data);

      if (idError || dataError) {
        res.status(400).json({
          success: false,
          error: idError ? idError.details[0].message : dataError?.details[0].message,
        });
        return;
      }     
      
      const response = await associationService.updateAssociation(parseInt(id), data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async deleteAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error } = associationIdSchema.validate(id);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const response = await associationService.deleteAssociation(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUsersFromAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { associationId } = req.params;

      const { error } = associationIdSchema.validate(associationId);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await associationService.getUsersFromAssociation(parseInt(associationId), { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUnitsFromAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { associationId } = req.params;

      const { error } = associationIdSchema.validate(associationId);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await associationService.getUnitsFromAssociation(parseInt(associationId), { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}

export default new PostgresAssociationController();