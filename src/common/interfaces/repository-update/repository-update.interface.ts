export interface RepositoryUpdate<T> {
  update: (id: string, updateDto: Partial<T>) => Promise<T>;
}
