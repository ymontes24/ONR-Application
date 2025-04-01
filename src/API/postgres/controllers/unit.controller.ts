import { Request, Response } from 'express';
import unitService from '../services/unit.service';
import { UnitAttributes } from '../interfaces/postgres.interfaces';
import { unitIdSchema, unitSchema } from '../schemas/unit.schemas';
import { associationIdSchema } from '../schemas/association.schemas';

export class PostgresUnitController {
  async getAllUnits(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await unitService.getAllUnits({ page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error } = unitIdSchema.validate(id);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const response = await unitService.getUnitById(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<UnitAttributes> = req.body;
      const { error } = unitSchema.validate(data);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }

      const response = await unitService.createUnit(data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;      
      const data: Partial<UnitAttributes> = req.body;
      const { error: idError } = unitIdSchema.validate(id);
      const { error: dataError } = unitSchema.validate(data);

      if (idError || dataError) {
        res.status(400).json({
          success: false,
          error: idError ? idError.details[0].message : dataError?.details[0].message,
        });
        return;
      }

      const response = await unitService.updateUnit(parseInt(id), data);
      
      if (response.success) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error } = unitIdSchema.validate(id);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const response = await unitService.deleteUnit(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUnitsByAssociation(req: Request, res: Response): Promise<void> {
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

      const response = await unitService.getUnitsByAssociation(parseInt(associationId), { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  async getUsersFromUnit(req: Request, res: Response): Promise<void> {
    try {
      const { unitId } = req.params;
      const { error } = unitIdSchema.validate(unitId);

      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
        return;
      }
      
      const response = await unitService.getUsersFromUnit(parseInt(unitId));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }
}

export default new PostgresUnitController();