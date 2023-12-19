export interface MetaData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export class PaginateResponse<T> {
  items: T;
  metaData: MetaData;

  constructor(items: T, metadta: MetaData) {
    this.items = items;
    this.metaData = metadta;
  }
}