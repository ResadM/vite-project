export interface PageParams {
  orderBy: string;
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
  columnFilters: string;
}