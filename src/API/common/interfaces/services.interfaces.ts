export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface PaginationOptions {
    page?: number;
    limit?: number;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface AssociationFilter {
    associationId: string | number;
  }

  export interface UnitFilter {
    unitId: string | number;
  }

  export interface createBooking {
    date: Date,
    timeStart: string,
    timeEnd: string
  }