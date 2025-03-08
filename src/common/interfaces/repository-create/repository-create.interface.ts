export interface RepositoryCreate<T> {
  create: (CreateDto: Omit<T, 'id'>) => Promise<Partial<T>>;
}
