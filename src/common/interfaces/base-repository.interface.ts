export default interface BaseRepositoryInterface<T> {
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
}
