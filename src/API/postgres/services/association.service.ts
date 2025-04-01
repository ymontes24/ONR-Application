import { Association, Unit, User } from '../models';
import { AssociationAttributes } from '../interfaces/postgres.interfaces';
import sequelize from '../../../config/postgresql';
import { PaginatedResponse, PaginationOptions, ServiceResponse } from '../../common/interfaces/services.interfaces';
import { Optional } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

export class PostgresAssociationService {

  async getAllAssociations(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<AssociationAttributes>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Association.findAndCountAll({
        distinct: true,
        attributes: ['id', 'name', 'address'],
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id', 'name'],
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

  async getAssociationById(id: number): Promise<ServiceResponse<AssociationAttributes>> {
    try {
      const association = await Association.findByPk(id, {
        attributes: ['name', 'address'],
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'users',
            attributes: ['id', 'names', 'lastNames', 'email'],
            through: { attributes: [] },
          },
        ],
      });

      if (!association) {
        return {
          success: false,
          error: 'Association not found',
        };
      }

      return {
        success: true,
        data: association,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createAssociation(data: Partial<AssociationAttributes>): Promise<ServiceResponse<AssociationAttributes>> {
    const transaction = await sequelize.transaction();

    try {
      const newAssociation = await Association.create(data as Optional<AssociationAttributes, NullishPropertiesOf<AssociationAttributes>>, { transaction });
      await transaction.commit();

      const createdAssociation = await Association.findByPk(newAssociation.id, {
        attributes: ['id', 'name', 'address'],
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id', 'name'],
          },
        ],
      });

      return {
        success: true,
        data: createdAssociation!,
        message: 'Association created successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async updateAssociation(id: number, data: Partial<AssociationAttributes>): Promise<ServiceResponse<AssociationAttributes>> {
    const transaction = await sequelize.transaction();

    try {
      const association = await Association.findByPk(id);

      if (!association) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Association not found',
        };
      }

      await association.update(data, { transaction });
      await transaction.commit();

      const updatedAssociation = await Association.findByPk(id, {
        attributes: ['id', 'name', 'address'],
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: ['id', 'name'],
          },
        ],
      });

      return {
        success: true,
        data: updatedAssociation!,
        message: 'Association updated successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async deleteAssociation(id: number): Promise<ServiceResponse<null>> {
    const transaction = await sequelize.transaction();

    try {
      const association = await Association.findByPk(id);

      if (!association) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Association not found',
        };
      }

      const units = await Unit.count({ where: { association_id: id } });
      if (units > 0) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Cannot delete the association because it has associated units',
        };
      }

      await association.destroy({ transaction });
      await transaction.commit();

      return {
        success: true,
        message: 'Association deleted successfully',
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async getUsersFromAssociation(associationId: number, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<any>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const association = await Association.findByPk(associationId);
      if (!association) {
        return {
          success: false,
          error: 'Association not found',
        };
      }

      const { count, rows } = await User.findAndCountAll({
        attributes: ['id', 'names', 'lastNames', 'email'],
        include: [
          {
            model: Association,
            as: 'associations',
            where: { id: associationId },
            attributes: [],
            through: { attributes: [] }
          }
        ],
        limit,
        offset,
        distinct: true
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

  async getUnitsFromAssociation(associationId: number, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<any>>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const association = await Association.findByPk(associationId);
      if (!association) {
        return {
          success: false,
          error: 'Asspciation not found',
        };
      }

      const { count, rows } = await Unit.findAndCountAll({
        where: { association_id: associationId },
        attributes: ['id', 'name'],
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'names', 'lastNames', 'email'],
            through: { 
              attributes: ['role'],
              as: 'membership'
            }
          }
        ],
        limit,
        offset,
        distinct: true
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
}

export default new PostgresAssociationService();