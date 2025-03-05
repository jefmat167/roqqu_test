import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractRepository<T> {
    abstract create(data: T): Promise<T>;
    
    abstract findAll(pageNumber: number, pageSize: number): Promise<T[] | null>;

    abstract findById(id: string | number): Promise<T | null>;

    abstract findOne(criteria: any): Promise<T | null>;
    
    abstract update(id: string | number, data: Partial<T>): Promise<T | null>;
    
    abstract delete(id: string | number): Promise<any> ;
}
