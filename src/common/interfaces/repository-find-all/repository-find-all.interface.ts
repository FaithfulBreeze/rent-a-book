export interface RepositoryFindAll<T> {
  findAll: (limit?: number, offset?: number) => Promise<Partial<T>[]>;
}
