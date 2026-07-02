export type PaginationOptions = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = PaginationOptions & {
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
