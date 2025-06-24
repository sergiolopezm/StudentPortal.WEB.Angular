export interface PaginacionDto<T> {
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }