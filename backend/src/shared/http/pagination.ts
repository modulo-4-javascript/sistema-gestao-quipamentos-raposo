import type {
  PaginatedResult,
  PaginationMeta,
  PaginationOptions
} from "../types/pagination";

export function paginate<T>(items: T[], options: PaginationOptions): PaginatedResult<T> {
  const page = options.page;
  const pageSize = options.pageSize;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  const meta: PaginationMeta = {
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize)
  };

  return { data, meta };
}
