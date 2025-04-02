import { Request, Response } from 'express';
import unitService from '../services/unit.service';
import { IUnit } from '../interfaces/mongodb.interfaces';

export class UnitController {
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
      const response = await unitService.getUnitById(id);
      
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
      //this code snippet is used to handle the association_id field due to swagger documentation issues
      if (req.body.association_id) {
        req.body.associationId = req.body.association_id;
        delete req.body.association_id;
      }

      const data: Partial<IUnit> = req.body;
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
      //this code snippet is used to handle the association_id field due to swagger documentation issues
      if (req.body.association_id) {
        req.body.associationId = req.body.association_id;
        delete req.body.association_id;
      }
      const data: Partial<IUnit> = req.body;
      const response = await unitService.updateUnit(id, data);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await unitService.deleteUnit(id);
      
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
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await unitService.getUnitsByAssociation({ associationId }, { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}

export default new UnitController();