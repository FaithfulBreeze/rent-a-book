export interface RepositoryFindOne<T> {
  findOne: (field: keyof T, value: unknown) => Promise<T>;
}
