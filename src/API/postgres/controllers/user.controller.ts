import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserAttributes } from '../interfaces/postgres.interfaces';
import {
  userIdSchema,
  createUserSchema,
  updateUserSchema,
  userEmailSchema,
  userRoleSchema,
} from '../schemas/user.schemas';
import { unitIdSchema } from '../schemas/unit.schemas';
import { associationIdSchema } from '../schemas/association.schemas';

export class PostgresUserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await userService.getAllUsers({ page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { error } = userIdSchema.validate(id);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
        return;
      }      
      
      const response = await userService.getUserById(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {

      const { error } = createUserSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details.map((error) => error.message).join(', '),
        });
        return;
      }

      const userData: Partial<UserAttributes> = req.body;
      const response = await userService.createUser(userData);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData: Partial<UserAttributes> = req.body;

      const { error: userIdError } = userIdSchema.validate(id);
      const { error: updateUserError } = updateUserSchema.validate(userData);
      
      if (userIdError || updateUserError) {
        const errors = [];
        if (userIdError) {
          errors.push(...userIdError.details.map((error) => error.message));
        }
        if (updateUserError) {
          errors.push(...updateUserError.details.map((error) => error.message));
        }
        
        res.status(400).json({
          success: false,
          error: errors.join(', '),
        });
        return;
      }

      const response = await userService.updateUser(parseInt(id), userData);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { error } = userIdSchema.validate(id);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
        return;
      }      
      
      const response = await userService.deleteUser(parseInt(id));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async getUsersByAssociation(req: Request, res: Response): Promise<void> {
    try {
      const { associationId } = req.params;

      const { error } = associationIdSchema.validate(associationId);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid association ID',
        });
        return;
      }
      
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const response = await userService.getUsersByAssociation({ associationId }, { page, limit });
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  async assignUnitToUser(req: Request, res: Response): Promise<void> {
    try {
      const {userId, unitId} = req.params;
      const role = req.body.role;

      const { error: userIdError } = userIdSchema.validate(userId);
      const { error: unitIdError } = unitIdSchema.validate(unitId);
      const { error: roleError } = userRoleSchema.validate(role);

      if (userIdError || unitIdError || roleError) {
        const errors = [];
        if (userIdError) {
          errors.push(...userIdError.details.map((error) => error.message));
        }
        if (unitIdError) {
          errors.push(...unitIdError.details.map((error) => error.message));
        }
        if (roleError) {
          errors.push(...roleError.details.map((error) => error.message));
        }
        
        res.status(400).json({
          success: false,
          error: errors.join(', '),
        });
        return;
      }
      
      const response = await userService.assignUnitToUser(parseInt(userId), parseInt(unitId), role);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  async removeUnitFromUser(req: Request, res: Response): Promise<void> {
    try {
      const {userId, unitId} = req.params;

      const { error: userIdError } = userIdSchema.validate(userId);
      const { error: unitIdError } = unitIdSchema.validate(unitId);

      if (userIdError || unitIdError) {
        const errors = [];
        if (userIdError) {
          errors.push(...userIdError.details.map((error) => error.message));
        }
        if (unitIdError) {
          errors.push(...unitIdError.details.map((error) => error.message));
        }        
        res.status(400).json({
          success: false,
          error: errors.join(', '),
        });
        return;
      }
      
      const response = await userService.removeUnitFromUser(parseInt(userId), parseInt(unitId));
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
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
      
      const response = await userService.getUserByEmail(email);
      
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }
}

export default new PostgresUserController();
