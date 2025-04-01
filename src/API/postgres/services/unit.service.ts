import sequelize from "../../../config/postgresql";
import { PaginatedResponse, PaginationOptions, ServiceResponse } from "../../common/interfaces/services.interfaces";
import { UnitAttributes } from "../interfaces/postgres.interfaces";
import { Association, Unit, User } from "../models";
import { Optional } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

export class PostgresUnitService {

  async getAllUnits(options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<UnitAttributes>>> {
    try {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Unit.findAndCountAll({
            distinct: true,
            attributes: ['id', 'name'],
            include: [
                {
                    model: Association,
                    as: 'association',
                    attributes: ['id', 'name', 'address'],
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

  async getUnitById(id: number): Promise<ServiceResponse<UnitAttributes>> {
    try {
        const unit = await Unit.findByPk(id, {
            attributes: ['name'],
            include: [
            {
                model: Association,
                as: 'association',
                attributes: ['id', 'name', 'address'],
            },
            ],
        });
    
        if (!unit) {
            return {
            success: false,
            error: 'Unit not found',
            };
        }
    
        return {
            success: true,
            data: unit,
        };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  async createUnit(data: Partial<UnitAttributes>): Promise<ServiceResponse<UnitAttributes>> {
    const transaction = await sequelize.transaction();
    try {
        const association = await Association.findByPk(data.association_id, { transaction });

        if (!association) {
            await transaction.rollback();
            return {
                success: false,
                error: 'Association not found',
            };
        }

        const unit = await Unit.create(data as Optional<UnitAttributes, NullishPropertiesOf<UnitAttributes>>, { transaction });

        await transaction.commit();

        const createdUnit = await Unit.findByPk(unit.id, {
            attributes: ['name'],
            include: [
                {
                    model: Association,
                    as: 'association',
                    attributes: ['id', 'name', 'address'],
                },
            ],
        });

        return {
            success: true,
            data: createdUnit!,
            message: 'Unit created successfully',
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        };
    }
  }

  async updateUnit(id: number, data: Partial<UnitAttributes>): Promise<ServiceResponse<UnitAttributes>> {
    const transaction = await sequelize.transaction();
    try {
        const unit = await Unit.findByPk(id, { transaction });

        if (!unit) {
            return {
                success: false,
                error: 'Unit not found',
            };
        }

        if (data.association_id) {
            const association = await Association.findByPk(data.association_id, { transaction });

            if (!association) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Association not found',
                };
            }
        }

        await unit.update(data, { transaction });

        await transaction.commit();

        const updatedUnit = await Unit.findByPk(id, {
            attributes: ['name'],
            include: [
                {
                    model: Association,
                    as: 'association',
                    attributes: ['id', 'name'],
                },
            ],
        });

        return {
            success: true,
            data: updatedUnit!,
            message: 'Unit updated successfully',
        };
    } catch (error) {
        await transaction.rollback();
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        };
    }
  }

  async deleteUnit(id: number): Promise<ServiceResponse<UnitAttributes>> {
    const transaction = await sequelize.transaction();
    try {
        const unit = await Unit.findByPk(id, { transaction });

        if (!unit) {
            await transaction.rollback();
            return {
                success: false,
                error: 'Unit not found',
            };
        }

        await unit.destroy({ transaction });

        await transaction.commit();

        return {
            success: true,
            message: 'Unit deleted successfully',
        };
    } catch (error) {
        await transaction.rollback();
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        };
    }
  }

  async getUnitsByAssociation(associationId: number, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<UnitAttributes>>> {
    try {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Unit.findAndCountAll({
            distinct: true,
            attributes: ['id', 'name'],
            where: { association_id: associationId },
            include: [
                {
                    model: Association,
                    as: 'association',
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

  async getUsersFromUnit(unitId: number, options?: PaginationOptions): Promise<ServiceResponse<PaginatedResponse<any>>> {
    try {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const offset = (page - 1) * limit;

        const unit = await Unit.findByPk(unitId);
        if (!unit) {
            return {
                success: false,
                error: 'Unit not found',
            };
        }

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'names', 'lastNames', 'email'],
            include: [
                {
                    model: Unit,
                    as: 'units',
                    where: { id: unitId },
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
}

export default new PostgresUnitService();