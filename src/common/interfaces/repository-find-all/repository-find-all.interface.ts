export interface RepositoryFindAll<T> {
  findAll: (limit?: number, offset?: number) => Promise<T[]>;
}
