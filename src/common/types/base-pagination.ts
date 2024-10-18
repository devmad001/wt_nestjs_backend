export class DataPagination<T> {
  private readonly items: T[];
  private readonly total: number;
  private readonly page: number;
  private readonly limit: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }

  toPaginationObject() {
    return {
      items: this.items,
      pageInfo: {
        page: this.page,
        limit: this.limit,
        totalPage: Math.ceil(this.total / this.limit),
        totalItems: this.total,
      },
    };
  }
}
