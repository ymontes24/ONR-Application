import { Request, Response } from 'express';
import associationService from '../services/association.service';
import { IAssociation } from '../interfaces/mongodb.interfaces';

export class AssociationController {
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
      const response = await associationService.getAssociationById(id);
      
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
      const data: Partial<IAssociation> = req.body;
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
      const data: Partial<IAssociation> = req.body;
      const response = await associationService.updateAssociation(id, data);
      
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
      const response = await associationService.deleteAssociation(id);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}

export default new AssociationController();