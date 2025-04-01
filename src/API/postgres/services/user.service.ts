import { User, Association, Unit, UserUnit, UserAssociation } from '../models';
import { UserAttributes, UserCreationAttributes } from '../interfaces/postgres.interfaces';
import sequelize from '../../../config/postgresql';
import { AssociationFilter, PaginatedResponse, PaginationOptions, ServiceResponse } from '../../common/interfaces/services.interfaces';
import { Optional } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

export class PostgresUserService {

  async getAllUsers(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<UserAttributes>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id'],
            through: { 
              attributes: ['role'],
              as: 'membership'
            },
          },
        ],
        limit,
        offset,
        distinct: true,
      });

      return {
        success: true,
        data: {
          items: rows,
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUserById(id: number): Promise<ServiceResponse<UserAttributes>> {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id'],
            through: { 
              attributes: ['role'],
              as: 'membership'
            },
          },
        ],
      });

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

  async createUser(userData: Partial<UserAttributes>): Promise<ServiceResponse<UserAttributes>> {
    const transaction = await sequelize.transaction();

    try {
      const newUser = await User.create(userData as Optional<UserCreationAttributes, NullishPropertiesOf<UserCreationAttributes>>, { transaction });

      await transaction.commit();

      const createdUser = await User.findByPk(newUser.id, {
        attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] }
      });

      return {
        success: true,
        data: createdUser!,
        message: 'Usuario creado exitosamente',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateUser(id: number, userData: Partial<UserAttributes>): Promise<ServiceResponse<UserAttributes>> {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(id);

      if (!user) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Usuario no encontrado',
        };
      }

      await user.update(userData, { transaction });

      await transaction.commit();

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
      });

      return {
        success: true,
        data: updatedUser!,
        message: 'User updated successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteUser(id: number): Promise<ServiceResponse<null>> {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(id);

      if (!user) {
        await transaction.rollback();
        return {
          success: false,
          error: 'User not found',
        };
      }

      await user.destroy({ transaction });
      await transaction.commit();

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUsersByAssociation(filter: AssociationFilter, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<UserAttributes>>> {
    try {
      const { associationId } = filter;
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
        distinct: true,
        include: [
          {
            model: Association,
            as: 'associations',
            where: { id: associationId },
            attributes: ['name', 'address'],
            through: { attributes: [] },
          },
          {
            model: Unit,
            as: 'units',
            attributes: ['name'],
            through: { 
              attributes: ['role'],
              as: 'membership'
            },
          },
        ],
        limit,
        offset,
      });

      return {
        success: true,
        data: {
          items: rows,
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUserByEmail(email: string): Promise<ServiceResponse<UserAttributes>> {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

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

  async assignUnitToUser(userId: number, unitId: number, role: 'owner' | 'resident'): Promise<ServiceResponse<any>> {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction });
      const unit = await Unit.findByPk(unitId, { transaction });

      if (!user) {
        await transaction.rollback();
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (!unit) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Unit not found',
        };
      }

      const [userUnit, created] = await UserUnit.findOrCreate({
        where: { user_id: userId, unit_id: unitId },
        defaults: { user_id: userId, unit_id: unitId, role },
        transaction,
      });

      if (!created) {
        // Si ya existe, actualizar el rol
        await userUnit.update({ role }, { transaction });
      }

      // Asignar automáticamente a la asociación si aún no está asignado
      const associationId = unit.association_id;

      const userAssociation = await UserAssociation.findOne({
        where: { user_id: userId, association_id: associationId },
        transaction,
      });

      if (!userAssociation) {
        await UserAssociation.create({ user_id: userId, association_id: associationId }, { transaction });
      }      

      await transaction.commit();

      return {
        success: true,
        message: `User assigned to the unit as ${role} successfully`,
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async removeUnitFromUser(userId: number, unitId: number): Promise<ServiceResponse<null>> {
    const transaction = await sequelize.transaction();

    try {
      const userUnit = await UserUnit.findOne({
        where: { user_id: userId, unit_id: unitId },
        transaction,
      });

      if (!userUnit) {
        await transaction.rollback();
        return {
          success: false,
          error: 'User is not assigned to the unit',
        };
      }

      await userUnit.destroy({ transaction });
      await transaction.commit();

      return {
        success: true,
        message: 'User removed from the unit successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUserByIdInternal(id: number): Promise<ServiceResponse<UserAttributes>> {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

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
}

export default new PostgresUserService();